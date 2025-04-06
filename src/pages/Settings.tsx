import { Box, Card, CardContent, Typography, Switch, FormControlLabel } from '@mui/material';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
  });

  const handleChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={() => handleChange('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={() => handleChange('darkMode')}
                />
              }
              label="Dark Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={() => handleChange('autoSave')}
                />
              }
              label="Auto Save"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 