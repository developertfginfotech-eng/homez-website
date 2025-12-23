"use client";
import PropertyApprovalDashboard from "@/components/property/admin/PropertyApprovalDashboard";
import Wrapper from "../../layout-wrapper/wrapper";

export default function PropertyApprovalPage() {
  return (
    <Wrapper>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <PropertyApprovalDashboard />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
