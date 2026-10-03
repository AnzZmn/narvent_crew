import type {IconName} from './components/icons';

export type SettingsPageId = 'profile' | 'payment' | 'docs' | 'about' | 'terms' | 'privacy' | 'contact';

export type Block =
  | {type: 'hero'; tagline: string}
  | {type: 'meta'; text: string}
  | {type: 'text'; heading: string; body: string}
  | {type: 'row'; icon: IconName; title: string; value: string; status?: 'Verified' | 'Pending'; onPress?: () => void}
  | {type: 'field'; key: string; label: string; value: string; keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'number-pad'; autoCapitalize?: 'none' | 'words' | 'characters'}
  | {type: 'note'; text: string}
  | {type: 'button'; label: string};

export type SettingsPage = {title: string; blocks: Block[]};

export type SettingsUser = {name: string; phone: string; initials: string; verified?: boolean};

export type SettingsRowDef = {id: SettingsPageId; icon: IconName; label: string; sub: string};
