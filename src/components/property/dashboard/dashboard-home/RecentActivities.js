"use client";

import React, { useState, useEffect } from "react";
import { dashboardAPI } from "@/services/api";
import Link from "next/link";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats();
        if (response.success && response.activities) {
          setActivities(response.activities);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2 fz14">Loading activities...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="flaticon-home text-muted" style={{ fontSize: "48px" }} />
        <p className="text-muted mt-3 fz14">No recent activities</p>
        <Link href="/dashboard-add-property" className="ud-btn btn-thm mt-3">
          Add Your First Property
          <i className="fal fa-arrow-right-long ms-2" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {activities.map((activity, index) => {
        // Determine styling based on activity type
        const isRejection = activity.type?.includes('rejected');
        const isApproved = activity.type?.includes('approved') || activity.type?.includes('verified');
        const isPending = activity.type?.includes('pending');

        const iconColor = isRejection ? 'text-danger' :
                         isApproved ? 'text-success' :
                         isPending ? 'text-warning' : '';

        const statusBadgeClass = isRejection ? 'badge bg-danger' :
                                isApproved ? 'badge bg-success' :
                                isPending ? 'badge bg-warning' : 'badge bg-secondary';

        return (
          <div
            key={index}
            className="recent-activity mb20"
            style={{
              padding: '15px',
              backgroundColor: isRejection ? '#fff5f5' : isApproved ? '#f0fdf4' : '#fff',
              borderRadius: '8px',
              border: isRejection ? '1px solid #fee2e2' : isApproved ? '1px solid #dcfce7' : '1px solid #f0f0f0',
            }}
          >
            <div className="d-flex align-items-start">
              <span
                className={`icon me-3 ${activity.icon} ${iconColor} flex-shrink-0`}
                style={{ marginTop: '2px', fontSize: '20px' }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <p className="text mb-0 flex-grow-1">
                    {activity.highlight ? (
                      <>
                        {activity.text.split(activity.highlight).map((part, i, array) =>
                          i === array.length - 1 ? (
                            part
                          ) : (
                            <React.Fragment key={i}>
                              {part}
                              <span className="fw600">{activity.highlight}</span>
                            </React.Fragment>
                          )
                        )}
                      </>
                    ) : (
                      activity.text
                    )}
                  </p>
                  {activity.status && (
                    <span className={`${statusBadgeClass} ms-2 fz12`} style={{ whiteSpace: 'nowrap' }}>
                      {activity.status}
                    </span>
                  )}
                </div>

                {/* Show rejection reason prominently if exists */}
                {isRejection && activity.reason && (
                  <div
                    className="mt-2 p-2"
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#991b1b',
                    }}
                  >
                    <i className="fas fa-exclamation-circle me-1"></i>
                    <strong>Reason:</strong> {activity.reason}
                  </div>
                )}

                {activity.date && (
                  <small className="text-muted fz12 d-block mt-2">
                    <i className="far fa-clock me-1"></i>
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {activities.length >= 7 && (
        <div className="d-grid mt-3">
          <Link href="/dashboard-my-properties" className="ud-btn btn-white2">
            View All Properties
            <i className="fal fa-arrow-right-long ms-2" />
          </Link>
        </div>
      )}
    </>
  );
};

export default RecentActivities;
