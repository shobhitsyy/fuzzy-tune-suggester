
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spotifyService } from '@/services/spotifyService';
import { useToast } from '@/hooks/use-toast';
import { Music, ExternalLink, Settings } from 'lucide-react';

interface SpotifyIntegrationProps {
  onAuthSuccess?: () => void;
}

const SpotifyIntegration: React.FC<SpotifyIntegrationProps> = ({ onAuthSuccess }) => {
  const [clientId, setClientId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    setIsAuthenticated(spotifyService.isAuthenticated());
    
    // Handle callback if coming from Spotify
    if (window.location.hash.includes('access_token')) {
      const success = spotifyService.handleCallback();
      if (success) {
        setIsAuthenticated(true);
        onAuthSuccess?.();
        toast({
          title: "Spotify Connected!",
          description: "You can now access enhanced music features.",
        });
      }
    }
  }, [onAuthSuccess, toast]);

  const handleSetupSpotify = () => {
    if (!clientId.trim()) {
      toast({
        title: "Client ID Required",
        description: "Please enter your Spotify Client ID first.",
        variant: "destructive",
      });
      return;
    }

    spotifyService.setClientId(clientId);
    const authUrl = spotifyService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setClientId('');
    toast({
      title: "Spotify Disconnected",
      description: "Your Spotify account has been disconnected.",
    });
  };

  if (isAuthenticated) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-800">Spotify Connected</p>
              <p className="text-sm text-green-600">Enhanced features available</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Music className="h-5 w-5" />
          Connect Spotify (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-700">
          Connect your Spotify account for enhanced features like playlist creation and better recommendations.
        </p>
        
        {!showSetup ? (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowSetup(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Setup Spotify
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://developer.spotify.com/dashboard/applications', '_blank')}
              className="text-blue-600 border-blue-300"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get Client ID
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="clientId" className="text-sm font-medium">
                Spotify Client ID
              </Label>
              <Input
                id="clientId"
                type="text"
                placeholder="Enter your Spotify Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can get this from your Spotify app in the Developer Dashboard
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSetupSpotify}
                disabled={!clientId.trim()}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Connect Spotify
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSetup(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotifyIntegration;
