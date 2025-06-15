
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { spotifyService } from '@/services/spotifyService';
import { spotifyDatabaseService } from '@/services/spotifyDatabaseService';
import { useToast } from '@/hooks/use-toast';
import { Database, RefreshCw, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { SongCategory } from '@/utils/fuzzyLogic';

const SpotifyDatabaseManager: React.FC = () => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isAddingCurated, setIsAddingCurated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAddCuratedSongs = async () => {
    setIsAddingCurated(true);
    setProgress(0);
    setResults(null);

    try {
      const results = await spotifyDatabaseService.addCuratedSongsToDatabase();
      setResults(results);
      setProgress(100);

      toast({
        title: "Songs Added Successfully",
        description: `Added ${results.added} new songs (${results.skipped} already existed).`,
      });
    } catch (error) {
      console.error('Add curated songs error:', error);
      toast({
        title: "Failed to Add Songs",
        description: error instanceof Error ? error.message : "Failed to add curated songs.",
        variant: "destructive",
      });
    } finally {
      setIsAddingCurated(false);
      setProgress(0);
    }
  };

  const handleEnrichExisting = async () => {
    setIsEnriching(true);
    setProgress(0);
    setResults(null);

    try {
      // Enrich in batches to show progress
      const totalBatches = 5;
      let totalResults = { updated: 0, newSongs: 0, errors: 0 };

      for (let i = 0; i < totalBatches; i++) {
        const batchResults = await spotifyDatabaseService.enrichExistingSongs(20);
        totalResults.updated += batchResults.updated;
        totalResults.newSongs += batchResults.newSongs;
        totalResults.errors += batchResults.errors;
        
        setProgress(((i + 1) / totalBatches) * 100);
        
        // Break if no more songs to enrich
        if (batchResults.updated === 0 && batchResults.errors === 0) break;
      }

      setResults(totalResults);
      toast({
        title: "Database Enrichment Complete",
        description: `Updated ${totalResults.updated} songs with Spotify data.`,
      });
    } catch (error) {
      console.error('Enrichment error:', error);
      toast({
        title: "Enrichment Failed",
        description: error instanceof Error ? error.message : "Failed to enrich database.",
        variant: "destructive",
      });
    } finally {
      setIsEnriching(false);
      setProgress(0);
    }
  };

  const handleDiscoverNew = async () => {
    setIsDiscovering(true);
    setProgress(0);
    setResults(null);

    try {
      const categoryResults = await spotifyDatabaseService.updateAllCategories();
      
      // Calculate totals
      const totals = Object.values(categoryResults).reduce(
        (acc, result) => ({
          updated: acc.updated + result.updated,
          newSongs: acc.newSongs + result.newSongs,
          errors: acc.errors + result.errors
        }),
        { updated: 0, newSongs: 0, errors: 0 }
      );

      setResults({ categoryResults, totals });
      setProgress(100);

      toast({
        title: "Song Discovery Complete",
        description: `Added ${totals.newSongs} new songs across all categories.`,
      });
    } catch (error) {
      console.error('Discovery error:', error);
      toast({
        title: "Discovery Failed",
        description: error instanceof Error ? error.message : "Failed to discover new songs.",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
      setProgress(0);
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Database className="h-5 w-5" />
          Spotify Database Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Add Curated Songs */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Add Popular Songs</h4>
            <p className="text-xs text-gray-600">
              Add 10 popular songs (5 English, 5 Hindi) with Spotify data
            </p>
            <Button
              onClick={handleAddCuratedSongs}
              disabled={isAddingCurated || isEnriching || isDiscovering}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {isAddingCurated ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Songs</span>
                </div>
              )}
            </Button>
          </div>

          {/* Enrich Existing Songs */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Enrich Existing</h4>
            <p className="text-xs text-gray-600">
              Add Spotify URLs and cover images to existing songs
            </p>
            <Button
              onClick={handleEnrichExisting}
              disabled={isEnriching || isDiscovering || isAddingCurated}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isEnriching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enriching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Enrich</span>
                </div>
              )}
            </Button>
          </div>

          {/* Discover New Songs */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Discover New</h4>
            <p className="text-xs text-gray-600">
              Find and add new songs using Spotify's recommendation engine
            </p>
            <Button
              onClick={handleDiscoverNew}
              disabled={isEnriching || isDiscovering || isAddingCurated}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isDiscovering ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Discovering...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Discover</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {(isEnriching || isDiscovering || isAddingCurated) && progress > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-gray-600">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="space-y-3 p-3 bg-white rounded-lg border">
            <h4 className="font-medium text-sm">Results</h4>
            
            {results.totals ? (
              // Discovery results with category breakdown
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {results.totals.newSongs} New Songs
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {results.totals.updated} Updated
                  </Badge>
                  {results.totals.errors > 0 && (
                    <Badge variant="destructive">
                      {results.totals.errors} Errors
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(results.categoryResults).map(([category, result]: [string, any]) => (
                    <div key={category} className="flex justify-between">
                      <span className="capitalize">{category}:</span>
                      <span>{result.newSongs} songs</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Enrichment or Add results
              <div className="flex gap-2 flex-wrap">
                {results.added !== undefined && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {results.added} Songs Added
                  </Badge>
                )}
                {results.updated !== undefined && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {results.updated} Songs Updated
                  </Badge>
                )}
                {results.skipped !== undefined && results.skipped > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {results.skipped} Skipped
                  </Badge>
                )}
                {results.errors > 0 && (
                  <Badge variant="destructive">
                    {results.errors} Errors
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotifyDatabaseManager;
