import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/LocationMap")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/LocationMap"!</div>;
}
