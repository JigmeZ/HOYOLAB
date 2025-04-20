import React, { useState } from 'react';
import './Sidebar.css';
import toolboxImg from '../assets/images/toolbox.png';
import checkinImg from '../assets/images/checkin.png';
import welkinImg from '../assets/images/welkin.png';
import getImg from '../assets/images/get.png';
import widgetsImg from '../assets/images/widgets.png';
import hoyowikiImg from '../assets/images/hoyowiki.png';
import mapImg from '../assets/images/map.png';
import chronicleImg from '../assets/images/chronicle.png'; 
import sketchImg from '../assets/images/sketch.png'; 
import postIcon from '../assets/icons/post.png'; 
import imageIcon from '../assets/icons/imagess.png'; 
import videoIcon from '../assets/icons/video.png'; 
import draftIcon from '../assets/icons/draft.png';
import user1Img from '../assets/images/user1.png';
import user2Img from '../assets/images/user2.png';


const Sidebar = () => {
    const genshinItems = [
        { name: 'Toolbox', img: toolboxImg },
        { name: 'Check-In', img: checkinImg },
        { name: 'Song of the Welkin Moon', img: welkinImg },
        { name: 'Raise Saurians and Get...', img: getImg },
        { name: 'Widget', img: widgetsImg },
        { name: 'HoYoWiki', img: hoyowikiImg },
        { name: 'Teyvat Interactive Map', img: mapImg },
        { name: 'Battle Chronicle', img: chronicleImg },
        { name: 'HoYoSketch', img: sketchImg },
    ];

    const [followedUsers, setFollowedUsers] = useState({});

    const handleFollowClick = (userName) => {
        setFollowedUsers((prev) => ({
            ...prev,
            [userName]: !prev[userName],
        }));
    };

    return (
        <div className="sidebar"> 
            <div className="container"> 
                <div className="post-header">
                    <h2>Post now~</h2> {/* Header */}
                    <a href="#" className="drafts-link">
                        <img src={draftIcon} alt="Drafts" className="drafts-icon" /> Drafts (0)
                    </a> {/* Drafts button */}
                </div>
                <div className="post-options">
                    <button>
                        <img src={postIcon} alt="Post" className="button-icon" />
                        <span className="button-label">Post</span>
                    </button>
                    <button>
                        <img src={imageIcon} alt="Image" className="button-icon" />
                        <span className="button-label">Image</span>
                    </button>
                    <button>
                        <img src={videoIcon} alt="Video" className="button-icon" />
                        <span className="button-label">Video</span>
                    </button>
                </div>
            </div>
            <div className="container"> 
                <div className="genshin-header">
                    <h3>Genshin Impact</h3> {/* Header */}
                    <div className="genshin-controls">
                        <span className="page-indicator">1</span>
                        <span className="page-indicator">2</span>
                    </div>
                </div>
                <div className="genshin-impact">
                    <div className="grid-container">
                        {genshinItems.map((item, index) => (
                            <div key={index} className="grid-item">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="grid-item-image"
                                />
                                <div className="grid-item-text">{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container recommended-users">
                <h3>Recommended Users</h3>
                <div className="user-card">
                    <div className="user-info">
                        <img src={user1Img} alt="User 1" className="user-icon" />
                        <div>
                            <div className="user-name">Zombs</div>
                            <div className="user-followers">New record of total followers 130k</div>
                        </div>
                    </div>
                    <button 
                        className="follow-button" 
                        onClick={() => handleFollowClick('Pun_Rii')}
                    >
                        {followedUsers['Pun_Rii'] ? 'Added' : '+'}
                    </button>
                </div>
                <div className="user-card">
                    <div className="user-info">
                        <img src={user2Img} alt="User 2" className="user-icon" />
                        <div>
                            <div className="user-name">Fritzqt</div>
                            <div className="user-followers">New record of total followers 41k</div>
                        </div>
                    </div>
                    <button 
                        className="follow-button" 
                        onClick={() => handleFollowClick('Junebu')}
                    >
                        {followedUsers['Junebu'] ? 'Added' : '+'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;