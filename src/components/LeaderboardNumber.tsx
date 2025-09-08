import React from 'react';

interface LeaderboardNumberProps {
  rank: number;
  methodName: string;
}

const LeaderboardNumber: React.FC<LeaderboardNumberProps> = ({ rank, methodName }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="px-2 py-1 rounded label-default text-black" style={{ backgroundColor: '#F2F2F7' }}>
        #{rank}
      </div>
      <span className="label-default text-black">{methodName}</span>
    </div>
  );
};

export default LeaderboardNumber;
