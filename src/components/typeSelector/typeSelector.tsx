import styles from './typeSelector.module.scss';
import React from 'react';
import Image from 'next/image';


interface Props {
    activeButton: string;
    onButtonClick: (buttonLabel: string) => void;
}


export default function TypeSelector({ activeButton, onButtonClick }: Props) {
    const buttons = ['All', 'Completed', 'Half Done', 'Nearly Done'];

    return (
        <div className={styles.buttonBar}>
            {buttons.map((buttonLabel) => (
                <div
                    key={buttonLabel}
                    className={`${styles.button} ${activeButton === buttonLabel ? styles.active : ''}`}
                    onClick={() => onButtonClick(buttonLabel)}
                >
                    {buttonLabel}
                </div>
            ))}
        </div>
    );
}
