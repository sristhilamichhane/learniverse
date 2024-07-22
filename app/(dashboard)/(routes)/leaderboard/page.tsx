import React from "react";

type LeaderboardProps = {};

const LeaderboardPage: React.FC<LeaderboardProps> = () => {
  const dummyData = [
    { rank: 1, user: "User1", progress: "95%" },
    { rank: 2, user: "User2", progress: "90%" },
    { rank: 3, user: "User3", progress: "85%" },
    { rank: 4, user: "User4", progress: "80%" },
    { rank: 5, user: "User5", progress: "75%" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 ">Leaderboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200">Rank</th>
            <th className="py-2 px-4 border-b border-gray-200">User</th>
            <th className="py-2 px-4 border-b border-gray-200">Progress</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((data) => (
            <tr key={data.rank} className="even:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                {data.rank}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                {data.user}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                {data.progress}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
