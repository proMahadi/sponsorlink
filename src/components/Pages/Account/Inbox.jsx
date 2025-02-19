import React, { useState, useEffect } from "react";
import styles from './Inbox.module.css';

export default function Inbox() {
    const [inboxData, setInboxData] = useState([]);
    const [selectedInbox, setSelectedInbox] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);

    
    useEffect(() => {
            document.body.style.overflowY = "hidden";
            return () => {
                document.body.style.overflowY = "auto";
            };
    }, []);

    useEffect(() => {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        
        const formattedInbox = applications.map(app => ({
            id: app.listing.name,
            participant: app.listing.name,
            participantImage: app.listing.image,
            messages: [
                {
                    id: 1,
                    sender: "System",
                    text: app.status === 'accepted' 
                        ? "Thank you for your application. We're excited to work with you! We'll be in touch shortly with next steps."
                        : app.status === 'rejected'
                        ? "Thank you for your application. Unfortunately, we won't be moving forward at this time. We wish you the best in your future endeavors."
                        : app.status === 'pending'
                        ? "Thank you for your application. We're currently reviewing it and will get back to you soon."
                        : "",
                    timestamp: app.timestamp,
                    isSentByUser: false
                }
            ],
            unread: app.seen
        }));

        setInboxData(formattedInbox);
    }, []);

    const generatePreview = (text) => {
        return text.length > 50 ? text.substring(0, 50) + "..." : text;
    };

    const handleInboxSelect = (inbox) => {
        // Update the inbox data to mark the selected inbox as read
        const updatedInboxData = inboxData.map(item => {
            if (item.id === inbox.id) {
                return {
                    ...item,
                    unread: false
                };
            }
            return item;
        });
        
        setInboxData(updatedInboxData);
        setSelectedInbox({...inbox, unread: false});
        setIsMobileView(true);
    };

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newMessage = {
            id: selectedInbox.messages.length + 1,
            sender: "You",
            text: replyText,
            timestamp: new Date().toISOString(),
            isSentByUser: true
        };

        const updatedInboxData = inboxData.map(item => {
            if (item.id === selectedInbox.id) {
                return {
                    ...item,
                    messages: [...item.messages, newMessage]
                };
            }
            return item;
        });

        setInboxData(updatedInboxData);
        setSelectedInbox({...selectedInbox, messages: [...selectedInbox.messages, newMessage]});
        setReplyText("");
    };

    const handleBackToList = () => {
        setIsMobileView(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReply(e);
        }
    };

    useEffect(() => {
        const handleGlobalClick = (e) => {
            const isPreviewPane = e.target.closest(`.${styles.previewPane}`);
            const isMessageItem = e.target.closest(`.${styles.messageItem}`);
            
            if (!isPreviewPane && !isMessageItem) {
                setSelectedInbox(null);
                setIsMobileView(false);
            }
        };

        document.addEventListener('click', handleGlobalClick);
        
        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    const formatMessageDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);
        
        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        }
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }
        
        return messageDate.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short'
        });
    };
    
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(message => {
            const date = new Date(message.timestamp).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };
    
    
    return (
        <div className={styles.inboxContainer}>
            {inboxData.length === 0 ? (
                <div className={styles.emptyInbox}>
                    There are no messages
                </div>
            ) : (
                <>
                    <div 
                        className={`${styles.messageList} ${isMobileView ? styles.hideMobile : ''}`}

                    >
                        <h2 style={{margin: "1rem"}}>Inbox</h2>
                        {inboxData.map((inbox, index) => (                            <div
                                key={inbox.id}
                                onClick={() => handleInboxSelect(inbox)}
                                className={`${styles.messageItem} 
                                    ${selectedInbox?.id === inbox.id ? styles.selected : ''} 
                                    ${inbox.unread ? styles.unread : ''}
                                    ${index === 0 ? styles.firstMessageItem : ''}`}
                            >
                                <div className={styles.messageHeader}>
                                    <div className={styles.participantInfo}>
                                        <img 
                                            src={inbox.participantImage} 
                                            alt={inbox.participant}
                                            className={styles.participantImage}
                                        />
                                        <span>{inbox.participant}</span>
                                    </div>
                                    <span className={styles.timestamp}>
                                        {new Date(inbox.messages[inbox.messages.length - 1].timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={`${styles.preview} ${styles.hideMobile}`}>
                                    {generatePreview(inbox.messages[inbox.messages.length - 1].text)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.previewPane} ${isMobileView ? styles.showMobile : ''}`}>
                        {selectedInbox ? (
                            <div className={styles.messageContent}>
                                <div className={styles.mobileHeader}>
                                    <button 
                                        className={styles.backButton}
                                        onClick={handleBackToList}
                                    >
                                        ← Back
                                    </button>
                                    <h2>{selectedInbox.participant}</h2>
                                </div>
                                <div className={styles.desktopHeader}>
                                    <h2>{selectedInbox.participant}</h2>
                                </div>
                                <div className={styles.messagesContainer}>
                                    {Object.entries(groupMessagesByDate(selectedInbox.messages))
                                        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                                        .map(([date, messages]) => (
                                            <React.Fragment key={date}>
                                                <div className={styles.dateSeparator}>
                                                    <span className={styles.dateText}>
                                                        {formatMessageDate(date)}
                                                    </span>
                                                </div>
                                                {messages.map((message, index) => {
                                                    const isLastSentMessage = 
                                                        message.isSentByUser && 
                                                        index === selectedInbox.messages.length - 1;

                                                    return (
                                                        <>
                                                            <div 
                                                                key={message.id}
                                                                className={`${styles.messageBubble} ${
                                                                    message.isSentByUser ? styles.sent : styles.received
                                                                }`}
                                                            >
                                                                <div className={styles.messageText}>{message.text}</div>
                                                                <div className={styles.messageTime}>
                                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                                </div>
                                                            </div>
                                                            {isLastSentMessage && (
                                                                <div className={styles.sentStatus}>Sent</div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                </div>


                                <div className={styles.replySection}>
                                    <form onSubmit={handleReply}>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className={styles.replyInput}
                                            placeholder="Type your message..."
                                            rows="3"
                                        />
                                        <button type="submit" className={styles.sendButton}>
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                No conversation selected
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}