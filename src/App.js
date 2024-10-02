import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [extractionType, setExtractionType] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [deviceType, setDeviceType] = useState('');
    const [output, setOutput] = useState([]);
    const [filePath, setFilePath] = useState('');

    const handleDeviceConnection = async () => {
        if (deviceType) {
            try {
                const response = await axios.post('http://localhost:5000/device/connect', { deviceType });
                setOutput(prevOutput => [...prevOutput, response.data.status]);
                setDeviceConnected(true);
            } catch (error) {
                console.error('Error connecting device:', error);
                setOutput(prevOutput => [...prevOutput, 'Error connecting device.']);
            }
        } else {
            alert('Please select a device type first.');
        }
    };

    const handleDeviceTypeChange = (event) => {
        setDeviceType(event.target.value);
        setSelectedOption('');
    };

    const handleExtraction = async (type) => {
        setExtractionType(type);
        setOutput(prevOutput => [...prevOutput, `Performing ${type} extraction...`]);
        try {
            const response = await axios.post('http://localhost:5000/device/extract', { extractionType: type });
            setOutput(prevOutput => [...prevOutput, response.data.status]);
        } catch (error) {
            console.error('Error during extraction:', error);
            setOutput(prevOutput => [...prevOutput, 'Error during extraction.']);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        handleExtraction(option);
    };

    const handleFileImport = async () => {
        if (filePath) {
            try {
                const response = await axios.post('http://localhost:5000/evidence/import', { filePath });
                setOutput(prevOutput => [...prevOutput, response.data.status]);
            } catch (error) {
                console.error('Error importing evidence:', error);
                setOutput(prevOutput => [...prevOutput, 'Error importing evidence.']);
            }
        } else {
            alert('Please provide a file path.');
        }
    };

    const handleDataAnalysis = async () => {
        try {
            const response = await axios.post('http://localhost:5000/data/analyze', { data: output });
            setOutput(prevOutput => [...prevOutput, response.data.status]);
        } catch (error) {
            console.error('Error during data analysis:', error);
            setOutput(prevOutput => [...prevOutput, 'Error during data analysis.']);
        }
    };

    const handleAIAnalysis = async () => {
        try {
            const response = await axios.post('http://localhost:5000/ai/analyze', { data: output });
            setOutput(prevOutput => [...prevOutput, response.data.status]);
        } catch (error) {
            console.error('Error during AI analysis:', error);
            setOutput(prevOutput => [...prevOutput, 'Error during AI analysis.']);
        }
    };

    const handleReportGeneration = async () => {
        try {
            const response = await axios.post('http://localhost:5000/reports/generate', { data: output });
            setOutput(prevOutput => [...prevOutput, response.data.status]);
        } catch (error) {
            console.error('Error generating report:', error);
            setOutput(prevOutput => [...prevOutput, 'Error generating report.']);
        }
    };

    const renderOptions = () => {
        switch (deviceType) {
            case 'Android':
                return (
                    <>
                        <button onClick={() => handleOptionSelect('adbFunctions')} className="option-button text-white">ADB Functions</button>
                        <button onClick={() => handleOptionSelect('androidLogicalEx')} className="option-button text-white">Android Logical Ex</button>
                        <button onClick={() => handleOptionSelect('androidPhysicalEx')} className="option-button text-white">Android Physical Ex</button>
                    </>
                );
            case 'USB':
                return (
                    <>
                        <button onClick={() => handleOptionSelect('usbImager')} className="option-button text-white">USB Imager</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/2 p-6 bg-white shadow-lg">
                <h1 className="text-5xl font-bold mb-6 border-b-2 border-gray-500">InquestiQ Forensics Tool</h1>

                <div className="mb-4 flex flex-col">
                    <label className="text-lg mb-2">Select Device Type:</label>
                    <select 
                        value={deviceType} 
                        onChange={handleDeviceTypeChange} 
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        <option value="">--Select Device--</option>
                        <option value="Android">Android Device</option>
                        <option value="iOS">iOS Device</option>
                        <option value="Windows">Windows PC</option>
                        <option value="Linux">Linux Machine</option>
                        <option value="USB">USB Drive</option>
                    </select>
                </div>

                <button 
                    onClick={handleDeviceConnection} 
                    className="bg-gray-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-gray-500 transition duration-200 mb-4"
                    title="Click to simulate device connection"
                >
                    Connect Device
                </button>

                {deviceConnected && (
                    <div className="options mt-8 p-6 border border-gray-500 rounded-lg bg-gray-700 w-1/2">
                        <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-500 text-white">Device Connected: {deviceType}</h2>
                        
                        <div className="flex flex-col">
                            {renderOptions()}
                        </div>

                        {/* Box for analysis options */}
                        <div className="mt-6 p-4 border border-gray-500 rounded-lg bg-gray-800">
                            <h3 className="text-xl font-bold mb-2 text-white">Analysis Options</h3>
                            <button onClick={handleDataAnalysis} className="option-button mt-2 text-white">Analyze Data</button><br></br>
                            <button onClick={handleAIAnalysis} className="option-button mt-2 text-white">AI Analysis</button>
                        </div>

                        {/* Box for report generation */}
                        <div className="mt-6 p-4 border border-gray-500 rounded-lg bg-gray-800">
                            <h3 className="text-xl font-bold mb-2 text-white">Report Generation</h3>
                            <button onClick={handleReportGeneration} className="option-button mt-2 text-white">Generate Report</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-1/2 p-6 bg-gray-800 text-white">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Output</h2>
                <div className="h-full overflow-y-auto">
                    {output.map((line, index) => (
                        <p key={index} className="mb-1">{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;