import React, {useRef} from 'react'
import axiosInstance from '../axiosinstance/axiosinstance'
import './dropdown.css'
import { Link } from 'react-router-dom'
const clickOutsideRef = (content_ref, toggle_ref) => {
    document.addEventListener('mousedown', (e) => {
        // user click toggle
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
            content_ref.current.classList.toggle('active')
        } else {
            // user click outside toggle and content
            if (content_ref.current && !content_ref.current.contains(e.target)) {
                content_ref.current.classList.remove('active')
            }
        }
    })
}

const Dropdown = props => {
    const handleLogout = async () => {
        try {
          // Effectuer une requête POST à votre API de déconnexion
          const response = await axiosInstance.post('logout/');
          localStorage.clear();
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
          // Gérer l'erreur (afficher un message d'erreur à l'utilisateur, etc.)
        }
    }
    const dropdown_toggle_el = useRef(null)
    const dropdown_content_el = useRef(null)

    clickOutsideRef(dropdown_content_el, dropdown_toggle_el)
    
    return (
        <div className='dropdown'>
            <button ref={dropdown_toggle_el} className="dropdown__toggle">
                {
                    props.icon ? <i className={props.icon}></i> : ''
                }
                {
                    props.badge ? <span className='dropdown__toggle-badge'>{props.badge}</span> : ''
                }
                {
                    props.customToggle ? props.customToggle() : ''
                }
            </button>
            
            <div ref={dropdown_content_el} className="dropdown__content">
                {
                    props.contentData && props.renderItems ? props.contentData.map((item, index) => props.renderItems(item, index)) : ''
                   
                } <Link to="/" onClick={handleLogout} > <div className="notification-item">
                <i className="bx bx-log-out-circle bx-rotate-180"></i>
                <span>logout</span>
            </div></Link>
                {
                    props.renderFooter ? (
                        <div className="dropdown__footer">
                            {props.renderFooter()}
                        </div>
                    ) : ''
                }
               
            </div>
        </div>
    )
}

export default Dropdown
