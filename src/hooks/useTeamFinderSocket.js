import { useState, useEffect, useRef, useCallback } from 'react';
import { mockTeams } from '../data/mockCommunityData';
import { useApp } from '../context/AppContext';

export const useTeamFinderSocket = () => {
  const { user } = useApp();
  const [teams, setTeams] = useState(mockTeams);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Sync teams helper
  const updateTeamInState = useCallback((teamId, updates) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const merged = { ...t, ...updates };
        // spotsLeft should reflect capacity - membersCount
        merged.spotsLeft = Math.max(0, merged.capacity - merged.membersCount);
        return merged;
      }
      return t;
    }));
  }, []);

  // WebSockets Connection
  useEffect(() => {
    const connectWS = () => {
      // Avoid duplicate connection attempts
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;

      console.log('Connecting to Team Finder WebSocket...');
      const socket = new WebSocket('ws://127.0.0.1:8000/ws/team-finder');
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('Team Finder WebSocket connected!');
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received WebSocket message:', message);
          
          const currentUser = userRef.current;
          
          switch (message.type) {
            case 'team_created':
              setTeams(prev => [message.payload, ...prev]);
              break;

            case 'join_request_sent':
              setTeams(prev => prev.map(t => {
                if (t.id === message.teamId) {
                  const isCurrentUser = message.userId === 'current_user' || 
                    (currentUser && (
                      message.userId === currentUser.id ||
                      message.userId === currentUser.email ||
                      message.userId === currentUser.name
                    ));
                  
                  // For the creator, add the request to pending requests
                  const isCreator = t.creator?.includes('(You)') || t.postedBy?.includes('(You)');
                  let pendingRequests = t.pendingRequests || [];
                  if (isCreator && message.payload) {
                    if (!pendingRequests.some(r => r.id === message.payload.id)) {
                      pendingRequests = [...pendingRequests, message.payload];
                    }
                  }
                  
                  return {
                    ...t,
                    status: isCurrentUser ? 'Pending' : t.status,
                    pendingRequests
                  };
                }
                return t;
              }));
              break;

            case 'join_request_approved':
              setTeams(prev => prev.map(t => {
                if (t.id === message.teamId) {
                  const isCurrentUser = 
                    message.userId === 'current_user' || 
                    (currentUser && (
                      message.userId === currentUser.id ||
                      message.userId === currentUser.email ||
                      message.userId === currentUser.name ||
                      message.applicantId === currentUser.id ||
                      message.applicantName === currentUser.name ||
                      message.requestId === currentUser.id
                    ));

                  const updatedMembersCount = 
                    message.payload?.membersCount !== undefined
                      ? message.payload.membersCount
                      : (t.membersCount + 1);

                  return {
                    ...t,
                    ...message.payload,
                    status: isCurrentUser ? 'Approved' : t.status,
                    membersCount: updatedMembersCount,
                    spotsLeft: Math.max(0, (message.payload?.capacity || t.capacity) - updatedMembersCount),
                    pendingRequests: (message.payload?.pendingRequests || t.pendingRequests || [])
                      .filter(req => req.id !== message.requestId)
                  };
                }
                return t;
              }));
              break;

            case 'join_request_rejected':
              setTeams(prev => prev.map(t => {
                if (t.id === message.teamId) {
                  const isCurrentUser = 
                    message.userId === 'current_user' || 
                    (currentUser && (
                      message.userId === currentUser.id ||
                      message.userId === currentUser.email ||
                      message.userId === currentUser.name ||
                      message.applicantId === currentUser.id ||
                      message.applicantName === currentUser.name ||
                      message.requestId === currentUser.id
                    ));

                  return {
                    ...t,
                    status: isCurrentUser ? 'Rejected' : t.status,
                    pendingRequests: (t.pendingRequests || []).filter(req => req.id !== message.requestId)
                  };
                }
                return t;
              }));
              break;

            case 'team_updated':
              updateTeamInState(message.teamId, message.payload);
              break;

            default:
              break;
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      socket.onclose = () => {
        console.log('Team Finder WebSocket closed. Retrying in 5 seconds...');
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
      };

      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
        socket.close();
      };
    };

    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [updateTeamInState]);

  // Client request actions - fall back to simulation if no connection
  const createTeam = useCallback((newTeam) => {
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'create_team', payload: newTeam }));
    } else {
      // Local simulation
      setTeams(prev => [newTeam, ...prev]);
    }
  }, [isConnected]);

  const sendJoinRequest = useCallback((teamId) => {
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'join_request', teamId }));
    } else {
      // Local simulation: change status to Pending, do NOT increase member count
      updateTeamInState(teamId, { status: 'Pending' });

      // Automatically simulate a backend approval event after 4 seconds to demonstrate flow!
      setTimeout(() => {
        setTeams(prev => prev.map(t => {
          if (t.id === teamId && t.status === 'Pending') {
            const updatedMembersCount = t.membersCount + 1;
            return {
              ...t,
              status: 'Approved',
              membersCount: updatedMembersCount,
              spotsLeft: Math.max(0, t.capacity - updatedMembersCount)
            };
          }
          return t;
        }));
      }, 4000);
    }
  }, [isConnected, updateTeamInState]);

  const approveRequest = useCallback((teamId, requestId, applicantName) => {
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'approve_request', teamId, requestId }));
    } else {
      // Local simulation: remove from pending, increment members count
      setTeams(prev => prev.map(t => {
        if (t.id === teamId) {
          const updatedMembersCount = t.membersCount + 1;
          const pendingRequests = t.pendingRequests ? t.pendingRequests.filter(r => r.id !== requestId) : [];
          return {
            ...t,
            membersCount: updatedMembersCount,
            spotsLeft: Math.max(0, t.capacity - updatedMembersCount),
            pendingRequests
          };
        }
        return t;
      }));
    }
  }, [isConnected]);

  const rejectRequest = useCallback((teamId, requestId) => {
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'reject_request', teamId, requestId }));
    } else {
      // Local simulation: just remove from pending
      setTeams(prev => prev.map(t => {
        if (t.id === teamId) {
          const pendingRequests = t.pendingRequests ? t.pendingRequests.filter(r => r.id !== requestId) : [];
          return {
            ...t,
            pendingRequests
          };
        }
        return t;
      }));
    }
  }, [isConnected]);

  return {
    teams,
    isConnected,
    createTeam,
    sendJoinRequest,
    approveRequest,
    rejectRequest
  };
};
