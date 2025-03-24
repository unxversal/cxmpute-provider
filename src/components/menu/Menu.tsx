import Button from "../button/button";
import styles from "./menu.module.css";
import { CircleArrowOutUpRight } from "lucide-react";

const cxmputeGreen = "#20a191";
const cxmputePink = "#fe91e8";
const cxmputeYellow = "#f8cb46";
const cxmputePurple = "#91a8eb";
// const cxmputeRed = "#d64989";
// const cxmputeSand = "#d4d4cb";
const cxmputeSlate = "#d4d4cb";
// const cxmputeBeige = "#f9f5f2";
// const cxmputeBeigerBeige = "#fdede3";

const Menu = () => {
    return (
        <div className={styles.menu}>
            <div className={styles.header}>
                <div className={styles.headeritem}>
                    <img src="/one.png" alt="logo" height={50} width={50}/>
                    <h1>Cxmpute</h1>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.item}>
                        <Button text="Dashboard" backgroundColor={cxmputeYellow} />
                    </div>
                    <div className={styles.item}>
                        <Button text="Referral Program" backgroundColor={cxmputePink} />
                    </div>
                    <div className={styles.item}>
                        <Button text="Rewards" backgroundColor={cxmputeGreen} />
                    </div>
                    
                </div>
            </div>
            
            <a href="https://cxmpute.cloud/maximize" target="_blank">
                <div className={styles.footer}>
                    <div className={styles.footerTag}>Cxmpute Blog</div>
                    <p>Learn how to optimize your experience.</p>
                    <h3>Read Blog</h3>
                    <div className={styles.footerIcon}>
                        <svg
                            className={styles.icon}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                            clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default Menu;