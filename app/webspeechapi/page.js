"use client"
import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import {
    AppBar,
    Box,
    Container,
    IconButton,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme,
    useMediaQuery,
    Tooltip,
    Fab,
    Snackbar,
    Alert,
    Stack,
    Button
} from '@mui/material';
import {
    Mic,
    MicOff,
    VolumeUp,
    ContentCopy,
    Download,
    Translate
} from '@mui/icons-material';

// Updated neutral color scheme
const themeColors = {
    primary: '#2C3E50',
    secondary: '#34495E',
    background: '#F5F6F7',
    text: '#2C3E50',
    accent: '#3498DB',
};

const SpeechRecognitionWithTranslation = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [translation, setTranslation] = useState('');
    const [error, setError] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('en');
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isTranslating, setIsTranslating] = useState(false);
    const recognition = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const languages = {
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        zh: 'Chinese',
        ar: 'Arabic',
        hi: 'Hindi',
        ja: 'Japanese',
        ko: 'Korean',
        ru: 'Russian',
        pt: 'Portuguese',
        it: 'Italian'
    };



    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.lang = sourceLanguage;

            recognition.current.onresult = (event) => {
                const results = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join('');
                setTranscript(results);
            };

            recognition.current.onerror = (event) => {
                setError(`Speech recognition error: ${event.error}`);
                showSnackbar('Speech recognition error', 'error');
                setIsListening(false);
            };

            recognition.current.onend = () => {
                if (isListening) {
                    recognition.current.start();
                }
            };
        } else {
            setError('Speech recognition is not supported in this browser');
            showSnackbar('Speech recognition not supported', 'error');
        }

        return () => {
            if (recognition.current) {
                recognition.current.stop();
            }
        };
    }, [sourceLanguage, isListening]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        try {
            setIsListening(true);
            setError('');
            recognition.current?.start();
        } catch (err) {
            console.error('Speech recognition error:', err);
            showSnackbar('Failed to start speech recognition', 'error');
            setIsListening(false);
        }
    };

    const stopListening = () => {
        try {
            setIsListening(false);
            recognition.current?.stop();
        } catch (err) {
            console.error('Error stopping speech recognition:', err);
        }
    };
    const translateText = async () => {
        if (!transcript || transcript.trim() === '') {
            showSnackbar('No text to translate', 'warning');
            return;
        }

        try {
            setIsTranslating(true);
            const response = await fetch('/webspeechapi/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: transcript,
                    sourceLanguage,
                    targetLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            setTranslation(data.translation);
        } catch (err) {
            console.error('Translation Error:', err);
            showSnackbar('An error occurred during translation', 'error');
        } finally {
            setIsTranslating(false);
        }
    };


    const speakTranslation = () => {
        if (!translation) {
            showSnackbar('No translation to speak', 'warning');
            return;
        }

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(translation);
            utterance.lang = targetLanguage + "-" + targetLanguage.toUpperCase();
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                showSnackbar('Error speaking translation', 'error');
            };
            window.speechSynthesis.speak(utterance);
        } else {
            showSnackbar('Text-to-speech is not supported in your browser', 'error');
        }
    };

    const copyToClipboard = async (text) => {
        if (!text) {
            showSnackbar('No text to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showSnackbar('Text copied to clipboard');
        } catch (err) {
            console.error('Clipboard error:', err);
            showSnackbar('Failed to copy text', 'error');
        }
    };

    const downloadTranscript = () => {
        if (!transcript && !translation) {
            showSnackbar('No content to download', 'warning');
            return;
        }

        try {
            const content = `Original (${languages[sourceLanguage]}): ${transcript}\nTranslation (${languages[targetLanguage]}): ${translation}`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `translation_${sourceLanguage}_to_${targetLanguage}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showSnackbar('Transcript downloaded');
        } catch (err) {
            console.error('Download error:', err);
            showSnackbar('Failed to download transcript', 'error');
        }
    };

    return (
        <Box sx={{
            flexGrow: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: themeColors.background
        }}>
            <AppBar position="static" sx={{ bgcolor: 'white' }} elevation={1}>
                <Container maxWidth="lg">
                    <Box sx={{ py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ color: themeColors.text }}>
                            Speech Translator
                        </Typography>
                    </Box>
                </Container>
            </AppBar>

            <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                        <FormControl fullWidth>
                            <InputLabel>From Language</InputLabel>
                            <Select
                                value={sourceLanguage}
                                label="From Language"
                                onChange={(e) => {
                                    setSourceLanguage(e.target.value);
                                    if (isListening) {
                                        stopListening();
                                    }
                                }}
                            >
                                {Object.entries(languages).map(([code, name]) => (
                                    <MenuItem key={code} value={code}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>To Language</InputLabel>
                            <Select
                                value={targetLanguage}
                                label="To Language"
                                onChange={(e) => setTargetLanguage(e.target.value)}
                            >
                                {Object.entries(languages).map(([code, name]) => (
                                    <MenuItem key={code} value={code}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <Tooltip title={isListening ? 'Stop listening' : 'Start listening'}>
                            <Fab
                                onClick={toggleListening}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: isListening ? '#EF4444' : themeColors.primary,
                                    '&:hover': {
                                        bgcolor: isListening ? '#DC2626' : themeColors.accent
                                    }
                                }}
                            >
                                {isListening ? <MicOff sx={{ fontSize: 32, color: 'white' }} /> : <Mic sx={{ fontSize: 32, color: 'white' }} />}
                            </Fab>
                        </Tooltip>
                    </Box>

                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: themeColors.text }}>Original Text:</Typography>
                            <Tooltip title="Copy original text">
                                <span>
                                    <IconButton
                                        onClick={() => copyToClipboard(transcript)}
                                        disabled={!transcript}
                                        size="small"
                                    >
                                        <ContentCopy />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                        <Typography variant="body1" sx={{ minHeight: 100, whiteSpace: 'pre-wrap', color: themeColors.text }}>
                            {transcript || 'Speak something to see the transcript...'}
                        </Typography>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <span>
                            <Button
                                variant="contained"
                                startIcon={<Translate />}
                                onClick={translateText}
                                disabled={!transcript || isTranslating}
                                sx={{
                                    bgcolor: themeColors.primary,
                                    '&:hover': {
                                        bgcolor: themeColors.accent
                                    }
                                }}
                            >
                                {isTranslating ? 'Translating...' : 'Translate'}
                            </Button>
                        </span>
                    </Box>

                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>

                            <Typography variant="subtitle1" sx={{ color: themeColors.text }}>Translation:</Typography>

                            <Tooltip title="Copy translation">
                                <span>                               <IconButton
                                    onClick={() => copyToClipboard(translation)}
                                    disabled={!translation}
                                    size="small"
                                >
                                    <ContentCopy />
                                </IconButton>
                                </span>

                            </Tooltip>

                        </Box>
                        <Typography variant="body1" sx={{ minHeight: 100, whiteSpace: 'pre-wrap', color: themeColors.text }}>
                            {translation || 'Translation will appear here...'}
                        </Typography>
                    </Paper>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Tooltip title="Speak translation">
                            <span>
                                <IconButton
                                    onClick={speakTranslation}
                                    disabled={!translation}
                                    sx={{ color: themeColors.primary }}
                                >
                                    <VolumeUp />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Download transcript">
                            <span>
                                <IconButton
                                    onClick={downloadTranscript}
                                    disabled={!transcript && !translation}
                                    sx={{ color: themeColors.primary }}
                                >
                                    <Download />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Stack>
            </Container>
            <Paper component="footer" sx={{ mt: 'auto', p: 2, bgcolor: 'white' }} elevation={1}>
                <Typography variant="body2" sx={{ color: themeColors.text }} align="center">
                    Note: All conversations are processed securely and confidentially.
                </Typography>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SpeechRecognitionWithTranslation