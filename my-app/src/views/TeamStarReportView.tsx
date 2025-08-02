import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// API base URLs
const TEAM_MEMBERS_API = 'http://192.168.100.21:8000'
const STAR_TRACKING_API = 'http://192.168.100.21:8002'

const TeamStarsReportView: React.FC = () => {
    // Type the params from the URL
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [teamId, setTeamId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [csvTable, setCsvTable] = useState<string[][]>([]);

    const location = useLocation();

    const parseCsv = (csv: string): string[][] => {
        return csv
            .trim()
            .split('\n')
            .map(row => row.split(',').map(cell => cell.trim()));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const teamIdFromUrl = queryParams.get('team_id');

                if (!teamIdFromUrl) {
                    throw new Error("team_id is missing from the URL.");
                }

                setTeamId(teamIdFromUrl);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const handleSend = async () => {
        const queryParams = new URLSearchParams(location.search);

        const team_id = queryParams.get('team_id');

        if (!team_id) {
            alert("Team ID is missing from the URL.");
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select both a start and end date.");
            return;
        }

        const TEAM_REQ_URL = `${STAR_TRACKING_API}/v1/teams/${team_id}/stars-report/download?start_date=${startDate}&end_date=${endDate}`;
        console.log(`Fetching team stars from: ${TEAM_REQ_URL}`);

        try {
            const response = await fetch(
                TEAM_REQ_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (!response.ok) {
                throw new Error('Failed to fetch team stars data.');
            }
            const data = await response.text();
            console.log(data); // Log the data for debugging
            const parsedCsv = parseCsv(data);
            setCsvTable(parsedCsv);
        } catch (error: any) {
            console.error('Error fetching team stars:', error);
            alert(`Error fetching team stars: ${error.message}`);
            return;
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h1>Team Stars Report for Team ID: {teamId}</h1>
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
            { csvTable.length > 0 && (
                <table border={1} cellPadding="5">
                    <thead>
                        <tr>
                            {csvTable[0].map((header, idx) => (
                                <th key={idx}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csvTable.slice(1).map((row, rIdx) => (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                    <td key={cIdx}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeamStarsReportView;