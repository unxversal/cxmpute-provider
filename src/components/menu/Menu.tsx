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
                        <Button text="Referral Program" backgroundColor={cxmputeYellow} />
                    </div>
                    <div className={styles.item}>
                        <Button text="Rewards" backgroundColor={cxmputeYellow} />
                    </div>
                    
                </div>
            </div>
            
            
            <div className={styles.footer}>
                <div className={styles.footerTag}>Cxmpute Blog</div>
                <p>Learn how to optimize your experience.</p>
                <h3>Read Blog</h3>
                <div className={styles.footerIcon}>
                    <CircleArrowOutUpRight />
                </div>
            </div>
        </div>
    );
};

export default Menu;