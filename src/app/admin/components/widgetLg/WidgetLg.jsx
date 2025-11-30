'use client';
import './widgetLg.css';

function WidgetLg() {
  const Button = ({ type }) => {
    const baseClass = 'widgetLgButton';
    return <button className={`${baseClass} ${type}`}>{type}</button>;
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Derniers inscriptions</h3>
      <table className="widgetLgTable">
        <thead>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Etudiants</th>
            <th className="widgetLgTh">Formation</th>
            <th className="widgetLgTh">Adresse</th>
            <th className="widgetLgTh">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr className="widgetLgTr">
            <td className="widgetLgFootballeur">
              <div className="widgetLgInitial">B</div>
              <span className="widgetLgName">Amir ayari</span>
            </td>
            <td className="widgetLgDate">dev web</td>
            <td className="widgetLgAmount">Rades</td>
            <td className="widgetLgStatus"><Button type="Validé" /></td>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgFootballeur">
              <div className="widgetLgInitial">S</div>
              <span className="widgetLgName">wael jlassi</span>
            </td>
            <td className="widgetLgDate">gaming</td>
            <td className="widgetLgAmount">Sfax</td>
            <td className="widgetLgStatus"><Button type="en-attente" /></td>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgFootballeur">
              <div className="widgetLgInitial">T</div>
              <span className="widgetLgName"> Chahir werteni</span>
            </td>
            <td className="widgetLgDate">MERN</td>
            <td className="widgetLgAmount">Tunis</td>
            <td className="widgetLgStatus"><Button type="Bloqué" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WidgetLg;


// 'use client'
// import "./widgetLg.css";
// import avatar from "./avatar/ryan.jpg";

// function WidgetLg() {
//   const Button = ({ type }) => {
//     return <button className={"widgetLgButton " + type}>{type}</button>;
//   };

//   return (
//     <div className="widgetLg">
//       <h3 className="widgetLgTitle">Latest transaction</h3>
//       <table className="widgetLgTable">
//         <thead>
//           <tr className="widgetLgTr">
//             <th className="widgetLgTh">Customer</th>
//             <th className="widgetLgTh">Date</th>
//             <th className="widgetLgTh">Amount</th>
//             <th className="widgetLgTh">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr className="widgetLgTr">
//             <td className="widgetLgUser">
//               <img src={avatar} alt="" className="widgetLgImg" />
//               <span className="widgetLgName">Ryan</span>
//             </td>
//             <td className="widgetLgDate">30 August</td>
//             <td className="widgetLgAmount">$122.35</td>
//             <td className="widgetLgStatus"><Button type="Approved" /></td>
//           </tr>
//           <tr className="widgetLgTr">
//             <td className="widgetLgUser">
//               <img src={avatar} alt="" className="widgetLgImg" />
//               <span className="widgetLgName">Ryan</span>
//             </td>
//             <td className="widgetLgDate">30 August</td>
//             <td className="widgetLgAmount">$122.35</td>
//             <td className="widgetLgStatus"><Button type="Declined" /></td>
//           </tr>
//           <tr className="widgetLgTr">
//             <td className="widgetLgUser">
//               <img src={avatar} alt="" className="widgetLgImg" />
//               <span className="widgetLgName">Ryan</span>
//             </td>
//             <td className="widgetLgDate">30 August</td>
//             <td className="widgetLgAmount">$122.35</td>
//             <td className="widgetLgStatus"><Button type="Pending" /></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default WidgetLg;