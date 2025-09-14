"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TextAnalysis } from '@/lib/types';

export function TextAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = (inputText: string): TextAnalysis => {
    // Word and character counts
    const words = inputText.trim() === '' ? [] : inputText.trim().split(/\s+/);
    const wordCount = words.length;
    const charCount = inputText.length;
    const charCountNoSpaces = inputText.replace(/\s/g, '').length;

    // Paragraph count
    const paragraphs = inputText.trim() === '' ? 0 : inputText.split('\n\n').filter(p => p.trim() !== '').length;

    // Sentence count (rough estimate)
    const sentences = inputText.trim() === '' ? 0 : inputText.split(/[.!?]+/).filter(s => s.trim() !== '').length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Simple readability score (Flesch Reading Ease approximation)
    const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
    const avgSyllablesPerWord = words.reduce((total, word) => total + countSyllables(word), 0) / wordCount || 0;
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));

    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy', 'beautiful', 'perfect', 'best', 'awesome', 'incredible', 'outstanding'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 'worst', 'disappointing', 'failed', 'problem', 'issue', 'difficult', 'hard', 'impossible'];
    
    const lowerText = inputText.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Extract key phrases (simple implementation)
    const keyPhrases = extractKeyPhrases(words);

    return {
      wordCount,
      charCount,
      charCountNoSpaces,
      paragraphs,
      sentences,
      readingTime,
      readabilityScore: Math.round(readabilityScore),
      sentiment,
      keyPhrases
    };
  };

  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const extractKeyPhrases = (words: string[]): string[] => {
    // Simple key phrase extraction - most frequent words (excluding common words)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 2 && !commonWords.has(cleanWord)) {
        wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
      }
    });

    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      const result = analyzeText(text);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 500);
  };

  const getReadabilityLevel = (score: number): { level: string; color: string } => {
    if (score >= 90) return { level: 'Very Easy', color: 'bg-green-500' };
    if (score >= 80) return { level: 'Easy', color: 'bg-green-400' };
    if (score >= 70) return { level: 'Fairly Easy', color: 'bg-yellow-400' };
    if (score >= 60) return { level: 'Standard', color: 'bg-yellow-500' };
    if (score >= 50) return { level: 'Fairly Difficult', color: 'bg-orange-400' };
    if (score >= 30) return { level: 'Difficult', color: 'bg-red-400' };
    return { level: 'Very Difficult', color: 'bg-red-500' };
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">📊 Text Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze your text for readability, sentiment, word count, and key insights.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
          <CardDescription>
            Paste or type your text below to analyze its characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {text.length} characters • {text.trim() === '' ? 0 : text.trim().split(/\s+/).length} words
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={!text.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Text'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Basic Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">📈</span>
                Basic Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">{analysis.wordCount}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">{analysis.charCount}</div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">{analysis.sentences}</div>
                  <div className="text-sm text-muted-foreground">Sentences</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <div className="text-2xl font-bold">{analysis.paragraphs}</div>
                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reading Time</span>
                <Badge variant="secondary">{analysis.readingTime} min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Characters (no spaces)</span>
                <Badge variant="outline">{analysis.charCountNoSpaces}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Readability & Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">🎯</span>
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Readability Score</span>
                  <Badge variant="outline">{analysis.readabilityScore}/100</Badge>
                </div>
                <Progress value={analysis.readabilityScore} className="mb-2" />
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${getReadabilityLevel(analysis.readabilityScore).color}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {getReadabilityLevel(analysis.readabilityScore).level}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sentiment</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${getSentimentColor(analysis.sentiment)}`}
                    />
                    <Badge variant="outline" className="capitalize">
                      {analysis.sentiment}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on positive and negative word analysis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Phrases */}
          {analysis.keyPhrases.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">🔑</span>
                  Key Phrases
                </CardTitle>
                <CardDescription>
                  Most frequently used words in your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyPhrases.map((phrase, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-sm"
                    >
                      {phrase}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}

      {!analysis && text.trim() && (
        <Card>
          <CardContent className="text-center py-8">
            <span className="text-4xl block mb-2">📊</span>
            <p className="text-muted-foreground">
              Click "Analyze Text" to get detailed insights about your content
            </p>
          </CardContent>
        </Card>
      )}

      {!text.trim() && (
        <Card>
          <CardContent className="text-center py-8">
            <span className="text-4xl block mb-2">✏️</span>
            <p className="text-muted-foreground">
              Enter some text above to start analyzing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}