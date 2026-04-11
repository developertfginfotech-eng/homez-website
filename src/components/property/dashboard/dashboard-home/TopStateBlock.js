"use client";

import React, { useState, useEffect } from "react";
import { dashboardAPI } from "@/services/api";

const TopStateBlock = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalReviews: 0,
    totalFavorites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats();
        if (response.success && response.stats) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statisticsData = [
    {
      text: "All Properties",
      title: loading ? "..." : stats.totalProperties.toString(),
      icon: "flaticon-home",
    },
    {
      text: "Total Views",
      title: loading ? "..." : stats.totalViews.toString(),
      icon: "flaticon-search-chart",
    },
    {
      text: "Total Visitor Reviews",
      title: loading ? "..." : stats.totalReviews.toString(),
      icon: "flaticon-review",
    },
    {
      text: "Total Favorites",
      title: loading ? "..." : stats.totalFavorites.toString(),
      icon: "flaticon-like",
    },
  ];

  return (
    <>
      {statisticsData.map((data, index) => (
        <div key={index} className="col-sm-6 col-xxl-3">
          <div className="d-flex justify-content-between statistics_funfact">
            <div className="details">
              <div className="text fz25">{data.text}</div>
              <div className="title">{data.title}</div>
            </div>
            <div className="icon text-center">
              <i className={data.icon} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopStateBlock;
