import React from 'react';
import tokenList from './tokenList.json';

function Tokens() {
  return (
      <div>
        <table className={"bg-dark border-1"}>
          <thead>
          <tr className={"text-white border-1"}>
            <th>Ticker</th>
            <th>Image</th>
            <th>Name</th>
            <th>Address</th>
            <th>Decimals</th>
          </tr>
          </thead>
          <tbody>
          {tokenList?.map((token, i) => {
            return (
                <tr className={"text-white border-1"} key={i}>
                  <td>{token.ticker}</td>
                  <td>
                    <img src={token.img} className={"w-50"} alt={token.name} />
                  </td>
                  <td>{token.name}</td>
                  <td>{token.address}</td>
                  <td>{token.decimals}</td>
                </tr>
            );
          })}
          </tbody>
        </table>
      </div>
  );
}

export default Tokens;