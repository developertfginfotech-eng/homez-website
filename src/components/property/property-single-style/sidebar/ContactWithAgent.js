"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { propertiesAPI, agentsAPI } from "@/services/api";

const ContactWithAgent = ({ propertyId }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch property to get agent reference
        const propertyResponse = await propertiesAPI.getById(propertyId);
        if (propertyResponse.success && propertyResponse.property) {
          const property = propertyResponse.property;

          // If property has agent data populated, use it
          if (property.agent) {
            const agentData = property.agent;
            setAgent({
              id: agentData._id || agentData.id,
              name: agentData.name || `${agentData.firstName || ''} ${agentData.lastName || ''}`.trim(),
              phone: agentData.phone || agentData.phoneNumber,
              whatsapp: agentData.whatsapp,
              image: agentData.profileImage || agentData.image || '/images/team/agent-3.png',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading agent...</span>
        </div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <>
      <div className="agent-single d-sm-flex align-items-center pb25">
        <div className="single-img mb30-sm">
          <Image
            width={90}
            height={90}
            className="w90"
            src={agent.image}
            alt={agent.name}
            onError={(e) => {
              e.target.src = '/images/team/agent-3.png';
            }}
          />
        </div>
        <div className="single-contant ml20 ml0-xs">
          <h6 className="title mb-1">{agent.name}</h6>
          <div className="agent-meta mb10 d-md-flex align-items-center">
            {agent.phone && (
              <a className="text fz15" href={`tel:${agent.phone}`}>
                <i className="flaticon-call pe-1" />
                {agent.phone}
              </a>
            )}
          </div>
          {agent.whatsapp && (
            <div className="agent-meta mb10">
              <a
                className="text fz15"
                href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp pe-1" />
                WhatsApp
              </a>
            </div>
          )}
          {agent.id && (
            <Link
              href={`/agent-single/${agent.id}`}
              className="text-decoration-underline fw600"
            >
              View Listings
            </Link>
          )}
        </div>
      </div>
      {/* End agent-single */}

      {agent.id && (
        <div className="d-grid">
          <Link href={`/agent-single/${agent.id}`} className="ud-btn btn-white2">
            Contact Agent
            <i className="fal fa-arrow-right-long" />
          </Link>
        </div>
      )}
    </>
  );
};

export default ContactWithAgent;
