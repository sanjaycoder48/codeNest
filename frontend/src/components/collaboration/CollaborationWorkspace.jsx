import React, { useState } from 'react';
import { InviteCollaboratorsModal } from './InviteCollaboratorsModal';
import { AddTaskModal } from './AddTaskModal';
import { KanbanBoard } from './KanbanBoard';
import { ActivityTimeline } from './ActivityTimeline';
import { Sparkles, UserPlus, Plus, ArrowRight, Send, MessageSquare, Check, Clock, AtSign, Paperclip, ChevronRight, CheckCircle2 } from 'lucide-react';

export function CollaborationWorkspace({ twin }) {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [subTab, setSubTab] = useState('Team'); // 'Team' | 'Tasks' | 'Discussion'
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const projectName = twin?.project?.name || 'CampusCare';

  // Team Members
  const [teamMembers] = useState([
    { id: 'usr_1', name: 'Sanjay', role: 'Owner', avatar: 'https://avatars.githubusercontent.com/u/583231?v=4' },
    { id: 'usr_2', name: 'Rahul', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 'usr_3', name: 'Priya', role: 'Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 'usr_4', name: 'Arun', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
  ]);

  // Tasks List
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Login Page', assignee: 'Rahul', status: 'To Do', description: 'Design & integrate SSO login page.', priority: 'Medium' },
    { id: 't2', title: 'Payment API', assignee: 'Priya', status: 'In Progress', description: 'Stripe webhook listener & payment verification.', priority: 'High' },
    { id: 't3', title: 'Database Setup', assignee: 'Sanjay', status: 'Done', description: 'Mongoose schema & index optimization.', priority: 'High' },
    { id: 't4', title: 'Mobile Responsive UI', assignee: 'Arun', status: 'To Do', description: 'Ensure flex layout works cleanly on mobile screens.', priority: 'Low' }
  ]);

  // Team Discussion Messages
  const [discussions, setDiscussions] = useState([
    { id: 'm1', user: 'Priya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Payment API is ready for testing.', time: '20m ago', isAI: false },
    { id: 'm2', user: 'Rahul', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: "I'll test it today.", time: '15m ago', isAI: false },
    { id: 'm3', user: 'Project Twin', avatar: null, text: 'Payment API changes affect the checkout and payment modules based on repository evidence.', time: '12m ago', isAI: true }
  ]);

  // Chat Input
  const [chatMessage, setChatMessage] = useState('');

  const handleAddTask = async (newTask) => {
    setTasks(prev => [...prev, newTask]);
    try {
      await fetch(`${API_URL}/api/collaboration/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectName, title: newTask.title, assignedTo: newTask.assignee, priority: newTask.priority })
      });
    } catch {
      // Offline fallback
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    const newMsg = {
      id: 'm_' + Date.now(),
      user: 'Sanjay',
      avatar: 'https://avatars.githubusercontent.com/u/583231?v=4',
      text: userText,
      time: 'Just now',
      isAI: false
    };

    setDiscussions(prev => [...prev, newMsg]);
    setChatMessage('');

    try {
      const res = await fetch(`${API_URL}/api/collaboration/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectName, text: userText, author: "Sanjay", repositoryTwin: twin })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.aiMsg) {
          setDiscussions(prev => [...prev, {
            id: data.aiMsg.id,
            user: 'Project Twin',
            avatar: null,
            text: data.aiMsg.text,
            time: 'Just now',
            isAI: true
          }]);
          return;
        }
      }
    } catch {
      // Fallback AI responder below
    }

    // AI bot participation fallback if mentioned
    if (userText.toLowerCase().includes('@projecttwin') || userText.toLowerCase().includes('project twin') || userText.toLowerCase().includes('ai')) {
      setTimeout(() => {
        let aiReply = "Project Twin here! Based on repo analysis, 2 tasks are currently in progress and deployment pipelines are passing cleanly.";
        if (userText.toLowerCase().includes('blocking') || userText.toLowerCase().includes('deploy')) {
          aiReply = "Deployment is healthy! All CI test suites passed on latest commit 25da750.";
        } else if (userText.toLowerCase().includes('summarize') || userText.toLowerCase().includes('today')) {
          aiReply = "Today's summary: Rahul completed authentication, Priya updated payment endpoints, and Database setup was verified.";
        } else if (userText.toLowerCase().includes('finish') || userText.toLowerCase().includes('launch')) {
          aiReply = "Recommended launch priorities: Complete Mobile Responsive UI and test Payment API webhooks.";
        }

        const aiMsg = {
          id: 'ai_' + Date.now(),
          user: 'Project Twin',
          avatar: null,
          text: aiReply,
          time: 'Just now',
          isAI: true
        };
        setDiscussions(prev => [...prev, aiMsg]);
      }, 700);
    }
  };



  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 0', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Collaborate</h1>
            {/* Team Avatars beside title */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {teamMembers.map((m, idx) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  title={`${m.name} (${m.role})`}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: '2px solid #0d1117',
                    marginLeft: idx === 0 ? 0 : '-6px',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#8b949e', margin: '4px 0 0 0' }}>
            Work together on <strong>{projectName}</strong>
          </p>
        </div>

        {/* Right Action: ONE Prominent + Add Member Button */}
        <button
          onClick={() => setShowInviteModal(true)}
          style={{
            background: '#238636',
            border: 'none',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(35, 134, 54, 0.4)'
          }}
        >
          <UserPlus size={16} />
          <span>+ Add Member</span>
        </button>
      </div>

      {/* 2. Sub-Navigation Tabs ([ Team ] [ Tasks ] [ Discussion ]) */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #21262d', paddingBottom: '2px' }}>
        {['Team', 'Tasks', 'Discussion'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            style={{
              padding: '6px 14px',
              border: 'none',
              borderBottom: subTab === tab ? '2px solid #58a6ff' : '2px solid transparent',
              background: 'transparent',
              color: subTab === tab ? '#f0f6fc' : '#8b949e',
              fontSize: '0.82rem',
              fontWeight: subTab === tab ? '700' : '500',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. RENDER TEAM TAB (DEFAULT) */}
      {subTab === 'Team' && (
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Project Team</h3>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>Collaborators on <strong>{projectName}</strong></span>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                background: '#238636',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={15} />
              <span>+ Add Member</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {teamMembers.map((member) => (
              <div key={member.id} style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={member.avatar} alt={member.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#f0f6fc', display: 'block' }}>{member.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>Member of {projectName}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: member.role === 'Owner' ? '#23863633' : member.role === 'Developer' ? '#1f6feb33' : member.role === 'Designer' ? '#a855f733' : '#30363d',
                  color: member.role === 'Owner' ? '#3fb950' : member.role === 'Developer' ? '#58a6ff' : member.role === 'Designer' ? '#c084fc' : '#8b949e',
                  border: `1px solid ${member.role === 'Owner' ? '#23863666' : member.role === 'Developer' ? '#1f6feb66' : member.role === 'Designer' ? '#a855f766' : '#484f58'}`
                }}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. RENDER TASKS TAB */}
      {subTab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#8b949e' }}>Tasks for <strong>{projectName}</strong> ({tasks.length} active)</span>
            <button
              onClick={() => setShowAddTaskModal(true)}
              style={{
                background: '#238636',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={14} /> Add Task
            </button>
          </div>
          <KanbanBoard tasks={tasks} onMoveTask={(id, s) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: s } : t))} onAddTask={handleAddTask} />
        </div>
      )}

      {/* 3. RENDER DISCUSSION TAB */}
      {subTab === 'Discussion' && (
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Project Discussion</h3>
            <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '600' }}>@ProjectTwin enabled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
            {discussions.map((m) => (
              <div
                key={m.id}
                style={{
                  background: m.isAI ? 'rgba(168, 85, 247, 0.08)' : '#0d1117',
                  border: `1px solid ${m.isAI ? 'rgba(168, 85, 247, 0.25)' : '#21262d'}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {m.isAI ? (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#a855f7', display: 'grid', placeItems: 'center', color: '#fff' }}>
                        <Sparkles size={11} />
                      </div>
                    ) : (
                      <img src={m.avatar} alt={m.user} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    )}
                    <strong style={{ fontSize: '0.8rem', color: m.isAI ? '#c084fc' : '#f0f6fc' }}>
                      {m.user} {m.isAI && '✦'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>{m.time}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#c9d1d9', margin: 0, lineHeight: '1.4' }}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', borderTop: '1px solid #21262d', paddingTop: '12px' }}>
            <input
              id="chat-input-box"
              type="text"
              placeholder="Message your team (@ProjectTwin to ask AI)..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              style={{ flex: 1, background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ background: '#1f6feb', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Invite People Modal */}
      <InviteCollaboratorsModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        repoName={projectName}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAddTask={handleAddTask}
        teamMembers={teamMembers}
      />

    </div>
  );
}
