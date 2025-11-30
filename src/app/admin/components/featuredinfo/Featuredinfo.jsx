'use client'
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import "./featuredinfo.css"

export default function FeaturedInfo() {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Nombre d'inscription</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">145</span>
          <span className="featuredMoneyRate">
            +8% <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">par rapport au mois dernier</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Formations Finalisées</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">72</span>
          <span className="featuredMoneyRate">
            -5% <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">par rapport au mois dernier</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Délai moyen des formations</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">48h</span>
          <span className="featuredMoneyRate">
            -2h <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">par rapport au mois dernier</span>
      </div>
    </div>
  )
}
