import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// API base URLs
// const TEAM_MEMBERS_API = 'https://team-members-service-237455253851.us-central1.run.app';
// const STAR_TRACKING_API = 'https://star-tracking-service-237455253851.us-central1.run.app';
const TEAM_MEMBERS_API = 'http://192.168.100.21:8000'
const STAR_TRACKING_API = 'http://192.168.100.21:8002'

// Define interfaces for our data models based on the Python code
interface TeamMember {
    id: string;
    name: string;
    email: string;
    // Add other fields if needed
}

interface StarSession {
    id: string;
    team_id: string;
    session_date: string;
    name: string;
}

const StarAssignmentView: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [sessionName, setSessionName] = useState<string>('');
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                const starSessionId = queryParams.get('star_session_id');

                if (!starSessionId) {
                    throw new Error("star_session_id is missing from the URL.");
                }

                // Fetch star session to get team_id
                const REQ_URL = `${STAR_TRACKING_API}/v1/star-sessions`;
                // Log the request URL for debugging
                console.log(`Fetching star sessions from: ${REQ_URL}`);
                const sessionResponse = await fetch(REQ_URL);
                if (!sessionResponse.ok) throw new Error('Failed to fetch star sessions.');
                const allSessions = await sessionResponse.json() as StarSession[];
                const session = allSessions.find(s => s.id === starSessionId);
                
                if (!session) {
                    throw new Error(`Star Session with ID ${starSessionId} not found.`);
                }
                
                setSessionName(session.name);
                const teamId = session.team_id;

                // Fetch team members
                const membersResponse = await fetch(`${TEAM_MEMBERS_API}/v1/teams/${teamId}/members`);
                if (!membersResponse.ok) throw new Error('Failed to fetch team members.');
                const teamMembers = await membersResponse.json() as TeamMember[];
                setMembers(teamMembers);

                // Initialize checkbox state
                const initialCheckedState = teamMembers.reduce((acc, member) => {
                    acc[member.id] = false;
                    return acc;
                }, {} as { [key: string]: boolean });
                setCheckedState(initialCheckedState);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const handleCheckboxChange = (memberId: string) => {
        setCheckedState(prevState => ({
            ...prevState,
            [memberId]: !prevState[memberId]
        }));
    };

    const handleSubmit = () => {
        const result = Object.keys(checkedState).map(memberId => ({
            team_member_id: memberId,
            selected: checkedState[memberId]
        }));
        
        console.log("Submitting selection:");
        console.log(JSON.stringify(result, null, 2));
        alert("Selection has been logged to the console.");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h1>Star Assignment for: {sessionName}</h1>
            <h3>Select Team Members</h3>
            <div style={{ textAlign: 'left', display: 'inline-block' }}>
                {members.map(member => (
                    <div key={member.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={checkedState[member.id] || false}
                                onChange={() => handleCheckboxChange(member.id)}
                            />
                            {member.name}
                        </label>
                    </div>
                ))}
            </div>
            <br />
            <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
                Log Selection
            </button>
        </div>
    );
}

export default StarAssignmentView;
