import { NextResponse } from 'next/server';
import PKPass from 'passkit-generator';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // PKPass 생성을 위한 인증서 경로 설정
    const certDirectory = path.join(process.cwd(), 'certificates');
    
    const pass = new PKPass({
      model: path.join(certDirectory, 'pass.json'),
      certificates: {
        wwdr: path.join(certDirectory, 'wwdr.pem'),
        signerCert: path.join(certDirectory, 'signerCert.pem'),
        signerKey: path.join(certDirectory, 'signerKey.pem'),
        // 인증서 비밀번호가 있다면 추가
        // signerKeyPassphrase: 'password'
      },
    });

    // 패스에 데이터 추가
    pass.headerFields.push({
      key: 'couple',
      label: '커플',
      value: `${data.partner1.name} & ${data.partner2.name}`,
    });

    pass.primaryFields.push({
      key: 'anniversary',
      label: '기념일',
      value: data.anniversaryDate,
    });

    pass.secondaryFields.push(
      {
        key: 'partner1',
        label: '파트너 1',
        value: data.partner1.name,
      },
      {
        key: 'partner2',
        label: '파트너 2',
        value: data.partner2.name,
      }
    );

    // PKPass 버퍼 생성
    const buffer = pass.generate();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
      },
    });
  } catch (error) {
    console.error('Error generating pass:', error);
    return NextResponse.json(
      { error: '패스 생성에 실패했습니다' },
      { status: 500 }
    );
  }
} 