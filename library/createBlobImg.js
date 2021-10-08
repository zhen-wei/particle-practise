export function createBlobImg(canvas) {
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load', () => {
            URL.revokeObjectURL(img.src);
            resolve(img);
        }, { once: true });
        canvas.toBlob(blob => {
            img.src = URL.createObjectURL(blob);
        });
    });
}
