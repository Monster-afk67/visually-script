/**
 * @fileOverview The main library file for Visually Script.
 * Contains the Presentation and Slide classes for programmatically building presentations.
 */

import type { 
    MediaItem, PresentationSlide, SlideElement, SourceItem, 
    TextSlideElement, ImageSlideElement, MathSlideElement, ShapeSlideElement, StickerSlideElement,
    GamificationElement, GamificationAction,
    Quiz, QuizQuestion, MultipleChoiceQuestion, OpenTextQuestion,
    CodeProject, CodeFile, QrCodeOptions
} from './types';

// Helper to generate unique IDs
const generateId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Represents a custom slide that can be built and added to a presentation.
 */
export class Slide {
    private slide: PresentationSlide;

    constructor(title: string, backgroundColor: string = '#FFFFFF') {
        this.slide = {
            id: generateId(),
            title: title,
            backgroundColor: backgroundColor,
            elements: [],
            borderStyle: 'none',
        };
    }

    private addElement(element: SlideElement) {
        this.slide.elements.push(element);
        return this;
    }

    /**
     * Adds a text element to the slide.
     * @param {Partial<Omit<TextSlideElement, 'id' | 'type'>>} props - Text properties.
     */
    addText(props: Partial<Omit<TextSlideElement, 'id' | 'type'>>) {
        const defaults = {
            content: 'New Text',
            x: 10, y: 10, width: 300, height: 50,
            fontSize: 24, color: '#000000', fontFamily: 'Alegreya', animation: 'none'
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'text' });
        return this;
    }
    
    /**
     * Adds an image element to the slide.
     * @param {Partial<Omit<ImageSlideElement, 'id' | 'type'>>} props - Image properties.
     */
    addImage(props: Partial<Omit<ImageSlideElement, 'id' | 'type'>>) {
        const defaults = {
            src: 'https://placehold.co/300x200.png',
            x: 10, y: 10, width: 300, height: 200
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'image' });
        return this;
    }

    /**
     * Adds a sticker (emoji) element to the slide.
     * @param {{ content: string, x: number, y: number, size?: number, rotation?: number }} props - Sticker properties.
     */
    addSticker(props: { content: string, x: number, y: number, size?: number, rotation?: number }) {
        const { content, x, y, size = 100, rotation = 0 } = props;
        const newElement: StickerSlideElement = {
            id: generateId(), type: 'sticker', content,
            x, y, width: size, height: size, // Width and height are derived from size
            fontSize: size, // Font size controls emoji size
            rotation,
        };
        this.addElement(newElement);
        return this;
    }
    
    /**
     * Adds a math/formula element to the slide.
     * @param {Partial<Omit<MathSlideElement, 'id' | 'type'>>} props - Math properties.
     */
    addMath(props: Partial<Omit<MathSlideElement, 'id' | 'type'>>) {
        const defaults = {
            content: 'E = mc^2',
            x: 10, y: 10, width: 200, height: 60,
            fontSize: 24, color: '#000000'
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'math' });
        return this;
    }

    /**
     * Adds a shape element to the slide.
     * @param {Partial<Omit<ShapeSlideElement, 'id' | 'type'>>} props - Shape properties.
     */
    addShape(props: Partial<Omit<ShapeSlideElement, 'id' | 'type'>>) {
        const defaults = {
            shape: 'rectangle',
            x: 10, y: 10, width: 150, height: 100,
            strokeColor: '#000000', strokeWidth: 2, fillColor: 'transparent'
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'shape' });
        return this;
    }
    
    /**
     * Adds an animated character to the slide.
     * @param {Partial<Omit<GamificationElement, 'id' | 'type'>>} props - Character properties.
     */
    addCharacter(props: Partial<Omit<GamificationElement, 'id' | 'type'>>) {
        const defaults = {
            character: 'char1',
            x: 50, y: 350, width: 150, height: 200,
            actions: [{ id: generateId(), type: 'text', text: 'Hello!' }]
        };
        this.addElement({ ...defaults, ...props, id: generateId(), type: 'gamification' });
        return this;
    }


    /**
     * Sets the background color of the slide.
     * @param {string} color - A CSS hex color string (e.g., '#FFFFFF').
     */
    setBackgroundColor(color: string) {
        this.slide.backgroundColor = color;
        return this;
    }

    /**
     * Sets a background image for the slide.
     * @param {string} url - The URL of the background image.
     */
    setBackgroundImageUrl(url: string) {
        this.slide.backgroundImageUrl = url;
        return this;
    }
    
    /**
     * Sets a border for the slide.
     * @param {{ style: PresentationSlide['borderStyle'], color?: string, width?: number }} props - Border properties.
     */
    setBorder(props: { style: PresentationSlide['borderStyle'], color?: string, width?: number }) {
        this.slide.borderStyle = props.style;
        if (props.color) this.slide.borderColor = props.color;
        if (props.width) this.slide.borderWidth = props.width;
        return this;
    }

    /**
     * Returns the internal slide object.
     * @internal
     */
    getSlideObject(): PresentationSlide {
        return this.slide;
    }
}


/**
 * The main class for creating a Visually presentation.
 */
export class Presentation {
    private mediaQueue: MediaItem[] = [];
    private sources: SourceItem[] = [];

    addMediaItem(item: Omit<MediaItem, 'id'>) {
        this.mediaQueue.push({ ...item, id: generateId(), transition: item.transition || 'fade' });
        return this;
    }
    
    addPdf(props: { name: string; dataUrl: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'pdf', currentPage: 1, ...props });
        return this;
    }
    
    addImage(props: { name: string; dataUrl: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'image', ...props });
        return this;
    }
    
    addYouTube(props: { name: string; url: string; notes?: string; transition?: MediaItem['transition'] }) {
        const getYouTubeEmbedUrl = (url: string): string | null => {
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(youtubeRegex);
            return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
        };
        const embedUrl = getYouTubeEmbedUrl(props.url);
        if (embedUrl) {
            this.addMediaItem({ type: 'youtube', embedUrl, ...props });
        } else {
            console.warn(`Invalid YouTube URL provided, skipping: ${props.url}`);
        }
        return this;
    }

    addVideo(props: { name: string; dataUrl: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'video', startTime: 0, timestamps: [], ...props });
        return this;
    }

    addOfficeFile(props: { name: string; dataUrl?: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'office', ...props });
        return this;
    }
    
    addUrl(props: { name: string; url: string; notes?: string; transition?: MediaItem['transition'] }) {
        this.addMediaItem({ type: 'url', ...props });
        return this;
    }

    /**
     * Adds a custom slide to the presentation.
     * @param {Slide} slide - An instance of the Slide class.
     */
    addSlide(slide: Slide) {
        this.addMediaItem({
            type: 'created-slide',
            name: slide.getSlideObject().title,
            slide: slide.getSlideObject(),
        });
        return this;
    }

    addSource(source: Omit<SourceItem, 'id'>) {
        this.sources.push({ ...source, id: generateId() });
        return this;
    }
    
    /**
     * Adds a quiz to the presentation.
     * @param {Omit<Quiz, 'id'>} quizData - The quiz data.
     */
    addQuiz(quizData: Omit<Quiz, 'id'>) {
        this.addMediaItem({
            type: 'quiz',
            name: quizData.title,
            quiz: { ...quizData, id: generateId() }
        });
        return this;
    }
    
    /**
     * Adds a code project to the presentation.
     * @param {Omit<CodeProject, 'id'>} projectData - The code project data.
     */
    addCodeProject(projectData: Omit<CodeProject, 'id'>) {
        this.addMediaItem({
            type: 'code-project',
            name: projectData.title,
            project: { ...projectData, id: generateId() },
            viewMode: 'overview'
        });
        return this;
    }
    
    /**
     * Adds a single code file to the presentation.
     * @param {Omit<CodeFile, 'id'>} fileData - The code file data.
     */
    addCodeFile(fileData: Omit<CodeFile, 'id'>) {
        this.addMediaItem({
            type: 'code-file',
            name: fileData.name,
            ...fileData
        });
        return this;
    }
    
    /**
     * Adds a CSV file to the presentation.
     * @param {{ name: string, content?: string, headers?: string[], rows?: (string | number)[][] }} csvData - The CSV data.
     */
    addCsv(csvData: { name: string; content?: string; headers?: string[]; rows?: (string | number)[][]; notes?: string; transition?: MediaItem['transition'] }) {
        if (!csvData.content && !csvData.rows) {
            console.warn('CSV item requires either content (raw string) or rows/headers.');
            return this;
        }

        let headers = csvData.headers || [];
        let rows = csvData.rows || [];
        let content = csvData.content || '';

        if (content && (!csvData.headers || !csvData.rows)) {
            const lines = content.split('\n').filter(line => line.trim() !== '');
            headers = lines[0]?.split(',').map(h => h.trim()) || [];
            rows = lines.slice(1).map(line => line.split(',').map(cell => {
                const trimmed = cell.trim();
                return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
            }));
        } else if (rows.length > 0 && !content) {
            content = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        }

        this.addMediaItem({
            type: 'csv',
            name: csvData.name,
            headers,
            rows,
            content,
            notes: csvData.notes,
            transition: csvData.transition,
        });
        return this;
    }

    /**
     * Adds a QR Code slide to the presentation.
     * @param {object} qrCodeData - The data for the QR code slide.
     */
    addQrCode(qrCodeData: { title: string, url: string, description?: string, backgroundColor?: string, qrOptions?: QrCodeOptions, notes?: string, transition?: MediaItem['transition'] }) {
        const defaults = {
            description: 'Scan the code',
            backgroundColor: '#FFFFFF',
            scanCount: 0,
            qrOptions: {},
        };
        this.addMediaItem({
            type: 'qr-code',
            name: qrCodeData.title,
            ...defaults,
            ...qrCodeData
        });
        return this;
    }


    /**
     * Exports the entire presentation to a JSON string compatible with Visually's import function.
     * @returns {string} The JSON representation of the presentation.
     */
    toJSON(): string {
        return JSON.stringify({
            mediaQueue: this.mediaQueue,
            sources: this.sources,
        }, null, 2);
    }
}
