import QRCode from "qrcode";

export async function generateQRCode(nftAddress: string): Promise<string> {
  //product page URL
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/product/${nftAddress}`;
  
  try {
    //generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR generation failed:', error);
    throw error;
  }
}

//function to generate QR code buffer
export async function generateQRCodeBuffer(nftAddress: string): Promise<Buffer> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/product/${nftAddress}`;
  return await QRCode.toBuffer(url);
}