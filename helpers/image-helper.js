#!/usr/bin/env node

"strict mode";

class ProfileImage {
    constructor(initials, options = {}) {
        this.initials = initials;
        this.width = 100;
        this.height = 100;
        this.textColor = options.textColor || "#ffffff";
        this.backgroundColor = options.backgroundColor;
        this.fontFamily = options.fontFamily || "sans-serif";
        this.fontSize = this.height / (this.initials.length * 0.5 + 1);
        this.fontWeight = options.fontWeight || "bold";
    }

    png() {
        // returns png as base64 string
        /* eslint-disable global-require */
        const { createCanvas } = require("canvas");
        const canvas = createCanvas(this.width, this.height);
        const context = canvas.getContext("2d");

        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = this.height / 2;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = `#${this.backgroundColor}`;
        context.fill();

        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.textAlign = "center";
        context.fillStyle = this.textColor;

        // context.textBaseline = "middle";
        context.fillText(
            this.initials,
            canvas.width / 2,
            canvas.height / 2 + (this.fontSize * 0.68) / 2,
        );
        return canvas.toDataURL("image/png");
    }
}

export const getRandomColor = async () => {
    let color = "";
    const possible = "ABCDEFabcdef0123456789";
    for (let i = 0; i < 6; i++)
        color += possible.charAt(Math.floor(Math.random() * possible.length));
    return color;
};

export const generateDummyProfileImg = async (name) => {
    const color = await getRandomColor();
    const text = name.slice(0, 2).toUpperCase();

    const img = new ProfileImage(text, {
        backgroundColor: color,
    });

    const src = img.png();

    return src;
};
