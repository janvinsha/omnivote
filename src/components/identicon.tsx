import React, { useEffect, useState } from 'react';
import blockies from 'ethereum-blockies';

type IdenticonProps = {
    address: string;
    size?: number;
};

const Identicon: React.FC<IdenticonProps> = ({ address, size = 40 }) => {
    const [dataUrl, setDataUrl] = useState<string>('');

    useEffect(() => {
        const icon = blockies.create({
            seed: address.toLowerCase(), // Address should be lowercase
            size: 8, // The number of pixels (default is 8x8)
            scale: size / 8, // Control the size of the image
        });
        setDataUrl(icon.toDataURL()); // Convert the canvas to a data URL
    }, [address, size]);

    return <img src={dataUrl} alt="Identicon" width={size} height={size} />;
};

export default Identicon;
