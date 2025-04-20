import React from 'react';
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

    return (
        <div className="sidebar"> 
            <div className="container"> 
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
        </div>
    );
};

export default Sidebar;