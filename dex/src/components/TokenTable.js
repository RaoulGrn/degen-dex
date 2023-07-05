import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TokenTable() {
    const [tokenData, setTokenData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [tokensPerPage] = useState(15);
    const [maxPageButtons] = useState(3);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

    const fetchTokenData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/tokenRankings');
            const { data } = response.data;
            console.log('API response:', data);
            setTokenData(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTokenData();
    }, []);

    console.log('tokenData:', tokenData);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!Array.isArray(tokenData) || tokenData.length === 0) {
        return <p>No token data available.</p>;
    }

    // Pagination
    const indexOfLastToken = currentPage * tokensPerPage;
    const indexOfFirstToken = indexOfLastToken - tokensPerPage;
    const currentTokens = tokenData.slice(indexOfFirstToken, indexOfLastToken);

    const totalButtons = Math.ceil(tokenData.length / tokensPerPage);
    let pageButtons = [];
    if (totalButtons <= maxPageButtons) {
        pageButtons = Array.from({ length: totalButtons }, (_, index) => index + 1);
    } else {
        const leftBoundary = Math.min(
            Math.max(currentPage - Math.floor(maxPageButtons / 2), 1),
            totalButtons - maxPageButtons + 1
        );
        const rightBoundary = Math.min(leftBoundary + maxPageButtons - 1, totalButtons);

        pageButtons = Array.from({ length: maxPageButtons }, (_, index) => leftBoundary + index);

        if (leftBoundary > 1) {
            pageButtons.unshift(1);
            if (leftBoundary > 1) {
                pageButtons.splice(2, 0, '...');
            }
        }

        if (rightBoundary < totalButtons) {
            if (rightBoundary < totalButtons - 1) {
                pageButtons.splice(pageButtons.length, 0, '...');
            }
            pageButtons.push(totalButtons);
        }
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const sortTable = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getValueByPath = (object, path) => {
        const properties = path.split('.');
        return properties.reduce((obj, property) => obj?.[property], object);
    };

    const sortedTokens = [...currentTokens].sort((a, b) => {
        const valueA = getValueByPath(a, sortConfig.key);
        const valueB = getValueByPath(b, sortConfig.key);

        if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="container mt-4">
            <table className="table table-dark table-bordered">
                <thead>
                <tr className="text-white">
                    <th>ID</th>
                    <th onClick={() => sortTable('cmc_rank')}>CMC Ranking</th>
                    <th onClick={() => sortTable('name')}>Name</th>
                    <th onClick={() => sortTable('symbol')}>Symbol</th>
                    <th onClick={() => sortTable('quote.USD.price')}>Price (USD)</th>
                    <th onClick={() => sortTable('circulating_supply')}>
                        Circulating Supply
                    </th>
                    <th onClick={() => sortTable('quote.USD.volume_24h')}>
                        24H Volume
                    </th>
                    <th onClick={() => sortTable('quote.USD.percent_change_24h')}>
                        Gain/Loss (24h)
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedTokens.map((token) => (
                    <tr className="text-white" key={token.id}>
                        <td>{token.id}</td>
                        <td>{token.cmc_rank}</td>
                        <td>{token.name}</td>
                        <td>{token.symbol}</td>
                        <td>${token.quote?.USD?.price.toFixed(2)}</td>
                        <td>{token.circulating_supply.toFixed(0)}</td>
                        <td>${token.quote?.USD?.volume_24h.toFixed(0)}</td>
                        <td>${token.quote?.USD?.percent_change_24h.toFixed(2)}%</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-center">
                {pageButtons.map((button, index) => (
                    <button
                        key={index}
                        className={`btn btn-dark me-2 ${
                            typeof button === 'number' && button === currentPage
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            typeof button === 'number' && paginate(button)
                        }
                        disabled={typeof button !== 'number' || button === currentPage}
                    >
                        {button}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TokenTable;