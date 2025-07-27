import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const BallCollectionView: React.FC = () => {
    // Type the params from the URL
    const { team_id } = useParams<{ team_id: string }>();

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleSend = () => {
        if (!team_id) {
            alert("Team ID is missing from the URL.");
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select both a start and end date.");
            return;
        }

        const logMessage = `retrieving ball collection services for team ${team_id} from dates ${startDate} to ${endDate}`;
        
        console.log(logMessage);
        alert("Message logged to the console!");
    };

    return (
        <div>
            <h1>Ball Collection Report for Team ID: {team_id}</h1>
            <div style={{ margin: '20px 0' }}>
                <label style={{ marginRight: '10px' }}>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleSend}>
                Send
            </button>
        </div>
    );
}

export default BallCollectionView;