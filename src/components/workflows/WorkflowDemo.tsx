import { Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { demoRegistry } from "../../demos/registry";

const WorkflowDemo = () => {
  const { slug } = useParams<{ slug: string }>();
  const Demo = slug ? demoRegistry[slug] : undefined;

  if (!Demo) {
    return <Navigate to="/services/automated-workflows" replace />;
  }

  return (
    <Suspense fallback={null}>
      <Demo />
    </Suspense>
  );
};

export default WorkflowDemo;
