import { Button, Form, Host, HStack, Image, Section, Spacer, Text } from '@expo/ui/swift-ui';
import { background, buttonStyle, clipShape, foregroundStyle, frame } from '@expo/ui/swift-ui/modifiers';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useData } from '@/lib/data';

const TIME = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });

function Row({ icon, color, title, value, onPress }: {
  icon: string;
  color: string;
  title: string;
  value?: string;
  onPress(): void;
}) {
  return (
    <Button modifiers={[buttonStyle('plain')]} onPress={onPress}>
      <HStack spacing={12}>
        <Image
          systemName={icon as never}
          color="white"
          size={15}
          modifiers={[frame({ width: 30, height: 30 }), background(color), clipShape('roundedRectangle', 8)]}
        />
        <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'primary' })]}>{title}</Text>
        <Spacer />
        {value ? <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>{value}</Text> : null}
        <Image systemName="chevron.right" size={13} color="secondary" />
      </HStack>
    </Button>
  );
}

export default function More() {
  const { signOut, setRepo } = useAuth();
  const data = useData();
  const { sync } = data;
  const status =
    sync.status === 'syncing'
      ? 'Syncing…'
      : sync.status === 'error'
        ? 'Failed'
        : data.pending > 0
          ? `${data.pending} waiting`
          : sync.lastSyncedAt
            ? `Synced ${TIME.format(sync.lastSyncedAt)}`
            : 'Up to date';

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          title="Sync"
          footer={
            <Text>
              {sync.status === 'error' && sync.error
                ? sync.error
                : 'Changes are committed to the repository a moment after you make them, and pulled every minute.'}
            </Text>
          }>
          <Row
            icon="arrow.triangle.2.circlepath"
            color="#2F6FED"
            title="Sync now"
            value={status}
            onPress={() => void data.syncNow()}
          />
          <Row
            icon="chevron.left.forwardslash.chevron.right"
            color="#24292F"
            title={`${data.repo.owner}/${data.repo.name}`}
            onPress={() => void WebBrowser.openBrowserAsync(`https://github.com/${data.repo.owner}/${data.repo.name}`)}
          />
        </Section>
        <Section title="Data">
          <Row icon="chart.bar.xaxis" color="#5F27CD" title="Spending summary" onPress={() => router.push('/more/summary')} />
          <Row
            icon="creditcard.fill"
            color="#1DD1A1"
            title="Accounts"
            value={String(data.accounts.length)}
            onPress={() => router.push('/more/accounts')}
          />
          <Row
            icon="square.grid.2x2.fill"
            color="#FF9F43"
            title="Categories"
            value={String(data.categories.length)}
            onPress={() => router.push('/more/categories')}
          />
          <Row icon="chart.pie.fill" color="#EE5253" title="Budgets" value={String(data.budgets.length)} onPress={() => router.push('/budgets')} />
        </Section>
        <Section>
          <Button label="Switch repository" onPress={() => setRepo(null)} />
          <Button
            label="Sign out"
            role="destructive"
            onPress={() =>
              Alert.alert('Sign out?', 'Changes that are not synced yet stay on this device.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign out', style: 'destructive', onPress: signOut },
              ])
            }
          />
        </Section>
      </Form>
    </Host>
  );
}
