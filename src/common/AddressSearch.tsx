import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

interface AddressSearchProps {
  onComplete?: (data: any) => void;
  className?: string;
}

const AddressSearch = ({ onComplete, className }: AddressSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
    setIsOpen(false);
    if (onComplete) {
      onComplete({ ...data, fullAddress });
    }
  };

  return (
    <div className={className}>
      {isOpen ? (
        <div className="border-neutral-4 overflow-hidden rounded-lg border">
          <DaumPostcode onComplete={handleComplete} onClose={() => setIsOpen(false)} autoClose={false} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-d1 text-neutral-8 border-neutral-4 hover:bg-neutral-2 w-full rounded-lg border bg-white p-4 text-left transition-colors"
        >
          {address || '주소를 검색하세요'}
        </button>
      )}
    </div>
  );
};

export default AddressSearch;
