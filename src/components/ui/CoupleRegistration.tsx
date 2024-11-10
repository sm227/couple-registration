'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

interface PartnerData {
  name: string;
  birthDate: string;
  phone: string;
}

interface FormData {
  partner1: PartnerData;
  partner2: PartnerData;
  anniversaryDate: string;
}

interface CoupleType {
  type: string;
  description: string;
  emoji: string;
  color: string;
}

const getCoupleType = (date: string, names: string[]): CoupleType => {
  const sum = names.join('').length + new Date(date).getDate();
  const types = [
    {
      type: "로맨틱 듀오",
      description: "달달함이 넘치는 커플",
      emoji: "🌹",
      color: "text-rose-500"
    },
    {
      type: "베스트 프렌즈",
      description: "우정이 사랑으로 발전한 커플",
      emoji: "🤝",
      color: "text-blue-500"
    },
    {
      type: "소울메이트",
      description: "운명적인 만남의 커플",
      emoji: "✨",
      color: "text-purple-500"
    },
    {
      type: "모험가 듀오",
      description: "새로운 도전을 즐기는 커플",
      emoji: "🌎",
      color: "text-green-500"
    },
    {
      type: "아티스트 커플",
      description: "창의력이 넘치는 커플",
      emoji: "🎨",
      color: "text-indigo-500"
    }
  ];
  return types[sum % types.length];
};

// 디데이 계산 함수 추가
const calculateDday = (date: string): number => {
  const start = new Date(date).getTime();
  const today = new Date().getTime();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
};

const CertificateContent = ({ formData, coupleType, handleDownload }: {
  formData: FormData;
  coupleType: CoupleType;
  handleDownload: () => Promise<void>;
}) => {
  const dday = calculateDday(formData.anniversaryDate);

  return (
    <div className="relative p-4 sm:p-8 backdrop-blur-sm max-w-[100vw]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center space-y-4 sm:space-y-6"
      >
        {/* 커플 이름 섹션 */}
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
          <span className="text-pink-500">{formData.partner1.name}</span>
          <span className="mx-1 sm:mx-2">❤️</span>
          <span className="text-pink-500">{formData.partner2.name}</span>
        </div>

        {/* 기념일 표시 */}
        <div className="text-gray-600 bg-white/50 rounded-lg p-3">
          <div className="text-xs sm:text-sm">우리의 시작</div>
          <div className="font-medium text-sm sm:text-base">
            {new Date(formData.anniversaryDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* 커플 타입 섹션 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/70 rounded-lg p-3 sm:p-4 shadow-lg"
        >
          <div className={`text-xl sm:text-2xl font-bold ${coupleType.color}`}>
            {coupleType.emoji} {coupleType.type} {coupleType.emoji}
          </div>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{coupleType.description}</p>
        </motion.div>

        {/* 디데이 카운터 */}
        <div className="bg-pink-50/70 rounded-lg p-3 sm:p-4">
          <h3 className="text-lg sm:text-xl font-bold text-pink-600">
            함께한 지 {dday}일째
          </h3>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
            ≈ {Math.floor(dday / 365)}년 {dday % 365}일
          </div>
        </div>

        {/* 해시태그 */}
        <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap justify-center gap-2">
          <span>#커플등록증</span>
          <span>#{coupleType.type}</span>
          <span>#우리만의_스토리</span>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
          <Button
            onClick={() => handleShare('instagram')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-sm sm:text-base py-2 px-4"
          >
            인스타그램 공유
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-sm sm:text-base py-2 px-4"
          >
            이미지 저장
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// 랜덤 미션 생성 함수
// const getRandomMission = () => {
//   const missions = [
//     "오늘 서로의 장점 3가지씩 말해주기 💕",
//     "깜짝 데이트 계획하기 🎉",
//     "첫 만남 장소에서 인증샷 찍기 📸",
//     "서로의 취향으로 옷 입혀주기 👕",
//     "같이 요리 만들어 먹기 🍳",
//     "포즈 맞춰서 인증샷 찍기 🤳",
//     "서로에게 손편지 쓰기 ✉️",
//     "추억의 장소 다시 방문하기 🏃‍♂️",
//   ];
//   return missions[Math.floor(Math.random() * missions.length)];
// };

// 공유 기능
const handleShare = async (platform: 'instagram' | 'twitter') => {
  const certificateElement = document.getElementById('couple-certificate');
  if (!certificateElement) return;


  const canvas = await html2canvas(certificateElement);
  const image = canvas.toDataURL('image/png');

  if (platform === 'instagram') {
    // 모바일에서 인스타그램 스토리 공유
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const blob = await (await fetch(image)).blob();
      const filesArray = [new File([blob], 'couple.png', { type: 'image/png' })];

      if (navigator.share) {
        await navigator.share({
          files: filesArray,
          title: '우리의 커플 등록증',
          text: '#커플등록증 #커플챌린지'
        });
      }
    }
  }

};

const CoupleRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    partner1: {
      name: '',
      birthDate: '',
      phone: ''
    },
    partner2: {
      name: '',
      birthDate: '',
      phone: ''
    },
    anniversaryDate: '',
  });

  const [isGenerated, setIsGenerated] = useState(false);

  const handleInputChange = (partner: 'partner1' | 'partner2', field: keyof PartnerData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [partner]: {
        ...prev[partner],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const handleDownload = async () => {
    const certificateElement = document.getElementById('couple-certificate');
    if (!certificateElement) return;


    const canvas = await html2canvas(certificateElement, {
      scale: 2, // 더 선명한 이미지를 위해 스케일 증가
      backgroundColor: null,
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${formData.partner1.name}_${formData.partner2.name}_커플등록증.png`;
    link.click();

    toast.success('이미지가 저장되었습니다! 💕');

  };

  return (
    <div className="min-h-screen w-full py-12 px-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-4xl mx-auto">
        {!isGenerated ? (
          <Card className="mb-8 shadow-lg">
            <CardHeader className="pb-8">
              <CardTitle className="text-center text-3xl font-bold flex items-center justify-center gap-2">
                <Heart className="text-pink-500" />
                커플 등록증 발급
              </CardTitle>
              <p className="text-center text-gray-600 mt-2">
                소중한 추억을 기록하세요
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">파트너 1</h3>
                    <div>
                      <Label htmlFor="p1-name">이름</Label>
                      <Input
                        id="p1-name"
                        value={formData.partner1.name}
                        onChange={(e) => handleInputChange('partner1', 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="p1-birth">생년월일</Label>
                      <Input
                        id="p1-birth"
                        type="date"
                        value={formData.partner1.birthDate}
                        onChange={(e) => handleInputChange('partner1', 'birthDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="p1-phone">연락처</Label>
                      <Input
                        id="p1-phone"
                        type="tel"
                        value={formData.partner1.phone}
                        onChange={(e) => handleInputChange('partner1', 'phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">파트너 2</h3>
                    <div>
                      <Label htmlFor="p2-name">이름</Label>
                      <Input
                        id="p2-name"
                        value={formData.partner2.name}
                        onChange={(e) => handleInputChange('partner2', 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="p2-birth">생년월일</Label>
                      <Input
                        id="p2-birth"
                        type="date"
                        value={formData.partner2.birthDate}
                        onChange={(e) => handleInputChange('partner2', 'birthDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="p2-phone">연락처</Label>
                      <Input
                        id="p2-phone"
                        type="tel"
                        value={formData.partner2.phone}
                        onChange={(e) => handleInputChange('partner2', 'phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="anniversary">기념일</Label>
                  <Input
                    id="anniversary"
                    type="date"
                    value={formData.anniversaryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, anniversaryDate: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  등록증 생성하기
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            <div id="couple-certificate">
              <CertificateContent
                formData={formData}
                coupleType={getCoupleType(formData.anniversaryDate, [formData.partner1.name, formData.partner2.name])}
                handleDownload={handleDownload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoupleRegistration;