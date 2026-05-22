// src/components/PlanLimitAlert.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Bot, Home, Plug, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanLimitAlertProps {
  // 'message' = monthly chat-message quota exhausted (added in 4-tier launch)
  type: 'agent' | 'property' | 'team' | 'message';
  current: number;
  limit: number;
  planName: string;
}

export const PlanLimitAlert: React.FC<PlanLimitAlertProps> = ({
  type,
  current,
  limit,
  planName
}) => {
  const getConfig = () => {
    switch (type) {
      case 'agent':
        return {
          title: 'Agent Limit Reached',
          description: `You've reached the maximum number of agents (${limit}) on your ${planName} plan.`,
          icon: Bot,
          upgradeText: 'Upgrade to create more agents'
        };
      case 'property':
        return {
          title: 'Property Limit Reached',
          description: `You've reached the maximum number of properties (${limit}) on your ${planName} plan.`,
          icon: Home,
          upgradeText: 'Upgrade to add more properties'
        };
      case 'team':
        return {
          title: 'Team Member Limit Reached',
          description: `You've reached the maximum number of team members (${limit}) on your ${planName} plan.`,
          icon: Users,
          upgradeText: 'Upgrade to invite more team members'
        };
      case 'message':
        return {
          title: 'Chat Message Limit Reached',
          description: `You've used all ${limit} chat messages this month on your ${planName} plan. Your AI agents are paused until you upgrade or your quota renews.`,
          icon: MessageSquare,
          upgradeText: 'Upgrade for more messages'
        };
      default:
        return {
          title: 'Limit Reached',
          description: `You've reached the limit for this feature on your ${planName} plan.`,
          icon: AlertTriangle,
          upgradeText: 'Upgrade for more capacity'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <Icon className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">{config.title}</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p className="mb-3">{config.description}</p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/settings">
              <Plug className="h-4 w-4 mr-2" />
              {config.upgradeText}
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};