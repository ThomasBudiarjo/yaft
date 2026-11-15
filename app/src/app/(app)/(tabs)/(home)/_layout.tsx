import { TabStack } from '@/components/tab-stack';

function greeting(hour = new Date().getHours()) {
  if (hour < 11) return 'Good morning';
  if (hour < 15) return 'Good afternoon';
  if (hour < 19) return 'Good evening';
  return 'Good night';
}

export default function HomeLayout() {
  return <TabStack title={greeting()} />;
}
