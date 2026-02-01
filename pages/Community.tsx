
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Heart, Send, Share2, MoreHorizontal, Image as ImageIcon, Repeat2, BadgeCheck, UserPlus, Check } from 'lucide-react';
import { UserRole } from '../types';

export const Community: React.FC = () => {
  const { posts, createPost, replyToPost, user } = useApp();
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('');
  const [isImageInputOpen, setIsImageInputOpen] = useState(false);
  const [activeLikeMap, setActiveLikeMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'for_you' | 'following'>('for_you');
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  // Follow System State
  const [following, setFollowing] = useState<Set<string>>(new Set());

  // Suggested Users (Mock Data)
  const suggestedUsers = [
    { id: 's1', name: 'Dr. Ramesh (Dean)', handle: 'dean_rnd', role: 'Faculty', avatar: 'R' },
    { id: 's2', name: 'Robotics Club', handle: 'robotics_sona', role: 'Club', avatar: 'RC' },
    { id: 's3', name: 'Sona Incubation', handle: 'sona_incubate', role: 'Org', avatar: 'SI' },
  ];

  const handlePost = () => {
    if (newContent.trim()) {
      createPost(newContent, newImage); 
      setNewContent('');
      setNewImage('');
      setIsImageInputOpen(false);
    }
  };

  const handleReplySubmit = (postId: string) => {
    if (replyContent.trim()) {
      replyToPost(postId, replyContent);
      setReplyContent('');
    }
  };

  const toggleLike = (postId: string) => {
    setActiveLikeMap(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleFollow = (userId: string) => {
    const newFollowing = new Set(following);
    if (newFollowing.has(userId)) {
      newFollowing.delete(userId);
    } else {
      newFollowing.add(userId);
    }
    setFollowing(newFollowing);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  // Filter posts logic
  const filteredPosts = activeTab === 'for_you' 
    ? posts 
    : posts.filter(post => following.has(post.authorId) || post.authorId === user?.id); // Show followed + own posts

  return (
    <div className="max-w-5xl mx-auto pb-20 flex gap-10 items-start justify-center">
      
      {/* Main Feed Column */}
      <div className="w-full max-w-xl flex-1">
        {/* Threads-style Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 pt-4 pb-0 mb-4">
          <div className="flex justify-center gap-12 font-bold text-sm pb-3 border-b border-gray-200">
             <button 
               onClick={() => setActiveTab('for_you')}
               className={`pb-3 border-b-2 transition-colors ${activeTab === 'for_you' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
             >
               For you
             </button>
             <button 
               onClick={() => setActiveTab('following')}
               className={`pb-3 border-b-2 transition-colors ${activeTab === 'following' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
             >
               Following
             </button>
          </div>
        </div>

        {/* Create Post Input Area */}
        <div className="px-4 py-4 mb-6 border-b border-gray-200 hidden md:block">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
               {user?.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-200" />
               ) : (
                 <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                   {user?.role === UserRole.ADMIN ? 'IC' : user?.name.charAt(0)}
                 </div>
               )}
               <div className="w-0.5 bg-gray-200 flex-grow mt-2 rounded-full min-h-[20px]"></div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-primary mb-1">{user?.role === UserRole.ADMIN ? 'IC Club Official' : user?.name}</p>
                  {user?.role === UserRole.ADMIN && <BadgeCheck size={14} className="text-blue-500 fill-blue-500 text-white mb-1" />}
              </div>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={user?.role === UserRole.ADMIN ? "Post an official announcement..." : "Start a thread..."}
                className="w-full bg-transparent border-none focus:ring-0 text-primary placeholder:text-gray-400 text-sm resize-none min-h-[40px] p-0 mb-2"
                rows={Math.max(1, newContent.split('\n').length)}
              />
              
              {newImage && (
                <div className="relative mb-3 group">
                  <img src={newImage} alt="Preview" className="rounded-xl max-h-60 w-auto border border-gray-100" />
                  <button 
                    onClick={() => setNewImage('')} 
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              )}

              {isImageInputOpen && (
                 <div className="mb-3 flex gap-2">
                    <input 
                       type="text" 
                       placeholder="Paste image URL here..." 
                       value={newImage}
                       onChange={(e) => setNewImage(e.target.value)}
                       className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                       autoFocus
                    />
                 </div>
              )}

              <div className="flex justify-between items-center">
                 <button 
                   onClick={() => setIsImageInputOpen(!isImageInputOpen)}
                   className={`text-gray-400 hover:text-primary transition-colors ${isImageInputOpen ? 'text-primary' : ''}`}
                 >
                   <ImageIcon size={18} />
                 </button>
                 <button 
                    onClick={handlePost}
                    disabled={!newContent.trim()}
                    className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                 >
                   Post
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-0">
          {filteredPosts.length === 0 && (
             <div className="text-center py-10 text-gray-400">
                <p>No posts yet. {activeTab === 'following' ? 'Try following more people!' : 'Be the first to post!'}</p>
             </div>
          )}

          {filteredPosts.map((post, index) => {
            const isLiked = activeLikeMap[post.id];
            const hasNextPost = index < filteredPosts.length - 1;
            const isFollowingAuthor = following.has(post.authorId);

            return (
              <div key={post.id} className="px-4 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex gap-3">
                  {/* Avatar Column */}
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => toggleFollow(post.authorId)}>
                       <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm overflow-hidden border border-gray-100">
                          {post.authorName.charAt(0)}
                       </div>
                       {/* Follow Plus Icon if not following and not self */}
                       {!isFollowingAuthor && post.authorId !== user?.id && (
                          <div className="absolute -bottom-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center border border-white">
                             <span className="text-[10px] font-bold">+</span>
                          </div>
                       )}
                    </div>
                    {/* Thread line */}
                    <div className={`w-0.5 bg-gray-200 flex-grow mt-2 rounded-full min-h-[20px] ${hasNextPost && expandedThread !== post.id ? '' : 'bg-gradient-to-b from-gray-200 to-transparent'}`}></div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 pb-4 border-b border-gray-100">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                         <h4 className="text-primary font-bold text-sm hover:underline cursor-pointer">{post.authorName}</h4>
                         {post.isVerified && <BadgeCheck size={14} className="text-blue-500 fill-blue-500 text-white" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs">{getTimeAgo(post.timestamp)}</span>
                        <button className="text-gray-400 hover:text-primary">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <p className="text-primary text-sm leading-normal whitespace-pre-wrap mb-3">
                      {post.content}
                    </p>

                    {/* Image Attachment */}
                    {post.image && (
                       <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
                          <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
                       </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-5 mt-1">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-red-500' : 'text-gray-800 hover:text-red-500'}`}
                      >
                        <Heart size={20} className={`transition-transform group-active:scale-75 ${isLiked ? 'fill-red-500' : ''}`} />
                      </button>
                      
                      <button 
                        onClick={() => setExpandedThread(expandedThread === post.id ? null : post.id)}
                        className={`flex items-center gap-1.5 transition-colors group ${expandedThread === post.id ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}
                      >
                        <MessageCircle size={20} className="group-active:scale-90 transition-transform" />
                      </button>

                      <button className="flex items-center gap-1.5 text-gray-800 hover:text-primary transition-colors group">
                        <Repeat2 size={20} className="group-active:rotate-180 transition-transform duration-500" />
                      </button>
                      
                      <button className="flex items-center gap-1.5 text-gray-800 hover:text-primary transition-colors">
                        <Send size={20} className="-rotate-45 mb-1" />
                      </button>
                    </div>

                    {/* Stats & Replies Text */}
                    {(post.likes > 0 || post.replies.length > 0) && (
                       <div className="mt-3 flex items-center gap-2">
                          {post.replies.length > 0 && (
                             <div className="flex items-center -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-gray-200 border border-white"></div>
                                <div className="w-4 h-4 rounded-full bg-gray-300 border border-white"></div>
                             </div>
                          )}
                          <p className="text-xs text-gray-400">
                             {post.replies.length > 0 && <span>{post.replies.length} replies</span>}
                             {post.replies.length > 0 && post.likes > 0 && <span className="mx-1">·</span>}
                             {post.likes + (isLiked ? 1 : 0) > 0 && <span>{post.likes + (isLiked ? 1 : 0)} likes</span>}
                          </p>
                       </div>
                    )}

                    {/* Thread Expansion (Working Replies) */}
                    {expandedThread === post.id && (
                       <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                          {/* Existing Replies */}
                          <div className="space-y-4 mb-4">
                             {post.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-gray-100">
                                   <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
                                      {reply.authorName.charAt(0)}
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-1">
                                         <p className="text-xs font-bold">{reply.authorName}</p>
                                         {reply.isVerified && <BadgeCheck size={12} className="text-blue-500 fill-blue-500 text-white" />}
                                         <span className="text-[10px] text-gray-400 ml-1">{getTimeAgo(reply.timestamp)}</span>
                                      </div>
                                      <p className="text-xs text-primary mt-0.5">{reply.content}</p>
                                   </div>
                                </div>
                             ))}
                          </div>

                          {/* Reply Input */}
                          <div className="flex gap-3 pl-2 items-center">
                             {user?.avatar ? (
                                 <img src={user.avatar} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                             ) : (
                                 <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                                    {user?.role === UserRole.ADMIN ? 'IC' : user?.name.charAt(0)}
                                 </div>
                             )}
                             <input 
                               type="text" 
                               value={replyContent}
                               onChange={(e) => setReplyContent(e.target.value)}
                               placeholder={`Reply to ${post.authorName}...`} 
                               className="flex-1 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none border-b border-transparent focus:border-gray-200 pb-1 transition-all"
                               onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(post.id)}
                             />
                             <button 
                               onClick={() => handleReplySubmit(post.id)}
                               disabled={!replyContent.trim()}
                               className="text-primary font-bold text-xs disabled:opacity-50"
                             >
                               Post
                             </button>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer "Threads" mark */}
        <div className="text-center py-8">
           <div className="w-8 h-8 mx-auto bg-black text-white rounded-lg flex items-center justify-center font-bold text-xs">
              IC
           </div>
        </div>
      </div>

      {/* Right Sidebar - Suggested Users (Desktop Only) */}
      <div className="hidden lg:block w-80 sticky top-24 space-y-6">
         <div className="bg-surface p-6 rounded-3xl border border-gray-200 shadow-sm">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Suggested for you</h3>
             <div className="space-y-4">
                {suggestedUsers.map(u => {
                   const isFollowing = following.has(u.id);
                   return (
                      <div key={u.id} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                               {u.avatar}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-primary hover:underline cursor-pointer">{u.name}</p>
                               <p className="text-xs text-gray-400">@{u.handle}</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => toggleFollow(u.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${isFollowing ? 'border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200' : 'bg-primary text-white border-primary hover:bg-gray-800'}`}
                         >
                            {isFollowing ? 'Following' : 'Follow'}
                         </button>
                      </div>
                   );
                })}
             </div>
             <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-secondary hover:text-primary cursor-pointer hover:underline">See more suggestions</p>
             </div>
         </div>

         <div className="px-2 text-[10px] text-gray-400 leading-relaxed">
             © 2024 IC Club Threads • Privacy • Terms • <span className="hover:underline cursor-pointer">Sona College</span>
         </div>
      </div>
    </div>
  );
};
