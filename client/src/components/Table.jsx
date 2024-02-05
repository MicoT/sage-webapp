import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const PersonChart = ({ data }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  const getChartData = () => {
    if (!selectedPerson) return [];

    // Filter data for the selected person
    const personData = data.filter((person) => person.PERSON_ID === selectedPerson.PERSON_ID);

    // Map the data to match the Nivo Bar Chart format
    return personData.map((entry) => ({
      month: `Month ${entry.MONTH}`,
      durationMinutes: entry.DURATION_MINUTES,
    }));
  };

  return (
    <div>
      <h2>Person Search</h2>
      <select onChange={(e) => handleSelectPerson(JSON.parse(e.target.value))}>
        <option value="" disabled selected>
          Select a person
        </option>
        {data.map((person) => (
          <option key={person.PERSON_ID} value={JSON.stringify(person)}>
            {`${person.FIRST_NAME} ${person.LAST_NAME}`}
          </option>
        ))}
      </select>

      {selectedPerson && (
        <div>
          <h3>{`${selectedPerson.FIRST_NAME} ${selectedPerson.LAST_NAME}'s Monthly Duration`}</h3>
          <div style={{ height: '400px' }}>
            <ResponsiveBar
              data={getChartData()}
              keys={['durationMinutes']}
              indexBy="month"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              enableLabel={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonChart;
