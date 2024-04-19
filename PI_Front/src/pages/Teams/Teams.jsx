import React, { useState, useEffect } from "react";
import Table from "../../components/table/Table";
import { fetchTeams } from "../../services/Teamservices/Teamservices";
import { deleteTeam } from "../../services/Teamservices/Teamservices";
const teamTableHead = [
  "",
  "team_name",
  "leader",
  "co_leader",
//   "members",
  "logo",
  // "club_name",
  "Actions",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index,handleDelete) => (
  <tr key={index}>
    <td></td>
    <td>{item.team_name}</td>
    <td>{item.leader_email}</td>
    <td>{item.co_leader_email}</td>
    <td>{""}</td>
    <td>
            <button className='delete-jery' onClick={() => handleDelete(item._id)}>Delete</button>
    </td>
  </tr>
);


const Teams = () => {
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTeams();
      setTeamList(data);
    };

    fetchData();
  }, []);
  const handleDelete = async (userId) => {
    try {
        await deleteTeam(userId);
        const updatedUsers = setTeamList.filter(team => team._id !== userId);
        setTeamList(updatedUsers);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
  return (
    <div>
      <h2 className="page-header">Teams</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                headData={teamTableHead}
                renderHead={renderHead}
                bodyData={teamList}
                renderBody={(item, index) => renderBody(item, index , handleDelete)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
