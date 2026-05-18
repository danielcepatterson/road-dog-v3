import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import './BusinessDocs.css';

interface BusinessDocsProps {
	onLogout: () => void;
}

interface FileItem {
	id: string;
	name: string;
	folder: string;
	type: string;
	size: number;
	uploadedBy: string;
	uploadedAt: string;
	data: string; // base64 encoded file data
}

interface FolderStructure {
	[folder: string]: FileItem[];
}

const DEFAULT_FOLDERS = [
	'logos and art',
	'media assets',
	'rental agreements',
	'performance contracts',
	'templates',
	'past invoices'
];

function BusinessDocs({ onLogout }: BusinessDocsProps) {
	const [folders, setFolders] = useState<string[]>(DEFAULT_FOLDERS);
	const [files, setFiles] = useState<FolderStructure>({});
	const [selectedFolder, setSelectedFolder] = useState<string>('');
	const [isCreatingFolder, setIsCreatingFolder] = useState(false);
	const [newFolderName, setNewFolderName] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState<string | null>(null);

	useEffect(() => {
		loadDocuments();
	}, []);

	const loadDocuments = async () => {
		try {
			setIsLoading(true);
			setError(null);
			
			const username = localStorage.getItem('currentUser');
			const password = localStorage.getItem('userPassword');
			
			if (!username || !password) {
				throw new Error('Not authenticated');
			}

			const response = await fetch('/api/documents', {
				headers: {
					'Authorization': 'Basic ' + btoa(`${username}:${password}`),
				},
			});

			if (!response.ok) {
				throw new Error('Failed to load documents');
			}

			const data = await response.json();
			
			if (data.folders && data.folders.length > 0) {
				setFolders(data.folders);
			} else {
				// Initialize with default folders if none exist
				await saveDocumentStructure(DEFAULT_FOLDERS, {});
			}
			
			setFiles(data.files || {});
		} catch (err) {
			console.error('Error loading documents:', err);
			// Initialize with defaults on error
			setFiles({});
		} finally {
			setIsLoading(false);
		}
	};

	const saveDocumentStructure = async (updatedFolders: string[], updatedFiles: FolderStructure) => {
		try {
			const username = localStorage.getItem('currentUser');
			const password = localStorage.getItem('userPassword');
			
			if (!username || !password) {
				throw new Error('Not authenticated');
			}

			const response = await fetch('/api/documents', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + btoa(`${username}:${password}`),
				},
				body: JSON.stringify({
					folders: updatedFolders,
					files: updatedFiles,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to save documents');
			}
		} catch (err) {
			setError('Failed to save changes. Please try again.');
			console.error('Error saving documents:', err);
		}
	};

	const handleCreateFolder = async () => {
		if (!newFolderName.trim()) return;
		
		if (folders.includes(newFolderName.trim())) {
			setError('Folder already exists');
			return;
		}

		const updatedFolders = [...folders, newFolderName.trim()];
		setFolders(updatedFolders);
		await saveDocumentStructure(updatedFolders, files);
		
		setNewFolderName('');
		setIsCreatingFolder(false);
	};

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, folder: string) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Check file size (limit to 4MB for KV storage)
		if (file.size > 4 * 1024 * 1024) {
			setError('File size must be less than 4MB');
			return;
		}

		try {
			setUploadProgress(`Uploading ${file.name}...`);
			setError(null);

			// Read file as base64
			const reader = new FileReader();
			reader.onload = async (e) => {
				const base64Data = e.target?.result as string;
				
				const newFile: FileItem = {
					id: Date.now().toString(),
					name: file.name,
					folder: folder,
					type: file.type,
					size: file.size,
					uploadedBy: localStorage.getItem('currentUser') || 'unknown',
					uploadedAt: new Date().toISOString(),
					data: base64Data,
				};

				const updatedFiles = { ...files };
				if (!updatedFiles[folder]) {
					updatedFiles[folder] = [];
				}
				updatedFiles[folder] = [...updatedFiles[folder], newFile];
				
				setFiles(updatedFiles);
				await saveDocumentStructure(folders, updatedFiles);
				setUploadProgress(null);
			};

			reader.onerror = () => {
				setError('Failed to read file');
				setUploadProgress(null);
			};

			reader.readAsDataURL(file);
		} catch (err) {
			setError('Failed to upload file. Please try again.');
			console.error('Error uploading file:', err);
			setUploadProgress(null);
		}
	};

	const handleDeleteFile = async (folder: string, fileId: string) => {
		if (!window.confirm('Are you sure you want to delete this file?')) {
			return;
		}

		const updatedFiles = { ...files };
		updatedFiles[folder] = updatedFiles[folder].filter(f => f.id !== fileId);
		
		setFiles(updatedFiles);
		await saveDocumentStructure(folders, updatedFiles);
	};

	const handleDownloadFile = (file: FileItem) => {
		const link = document.createElement('a');
		link.href = file.data;
		link.download = file.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	};

	const getFileIcon = (type: string) => {
		if (type.startsWith('image/')) return '🖼️';
		if (type.includes('pdf')) return '📄';
		if (type.includes('word') || type.includes('document')) return '📝';
		if (type.includes('sheet') || type.includes('excel')) return '📊';
		return '📎';
	};

	return (
		<div className="app-container">
			<div className="page-header">
				<div className="header-top">
					<Link to="/" className="back-link">← Back to Home</Link>
					<button onClick={onLogout} className="logout-btn-small">Logout</button>
				</div>
				<div className="title-with-logo">
					<img src="/road-dog-logo.jpg" alt="Road Dog" className="logo-small" />
					<h1>business docs</h1>
				</div>
				<p className="page-subtitle">oc3 / documents</p>
			</div>

			{error && (
				<div className="error-banner">
					{error}
					<button onClick={() => setError(null)} className="error-close">×</button>
				</div>
			)}

			{uploadProgress && (
				<div className="upload-progress">
					{uploadProgress}
				</div>
			)}

			{isLoading ? (
				<div className="loading-state">Loading documents...</div>
			) : (
				<div className="docs-container">
					<div className="docs-sidebar">
						<div className="sidebar-header">
							<h3>📁 Folders</h3>
							<button 
								className="btn-icon"
								onClick={() => setIsCreatingFolder(true)}
								title="Create new folder"
							>
								+
							</button>
						</div>

						{isCreatingFolder && (
							<div className="folder-input">
								<input
									type="text"
									value={newFolderName}
									onChange={(e) => setNewFolderName(e.target.value)}
									placeholder="Folder name"
									onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
									autoFocus
								/>
								<button onClick={handleCreateFolder} className="btn-sm btn-primary">✓</button>
								<button onClick={() => {
									setIsCreatingFolder(false);
									setNewFolderName('');
								}} className="btn-sm">×</button>
							</div>
						)}

						<div className="folder-list">
							{folders.map(folder => (
								<div
									key={folder}
									className={`folder-item ${selectedFolder === folder ? 'active' : ''}`}
									onClick={() => setSelectedFolder(folder)}
								>
									<span className="folder-icon">📁</span>
									<span className="folder-name">{folder}</span>
									<span className="folder-count">
										{files[folder]?.length || 0}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="docs-main">
						{selectedFolder ? (
							<>
								<div className="folder-header">
									<h2>{selectedFolder}</h2>
									<label className="btn-upload">
										<input
											type="file"
											onChange={(e) => handleFileUpload(e, selectedFolder)}
											accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
											style={{ display: 'none' }}
										/>
										📤 Upload File
									</label>
								</div>

								<div className="file-grid">
									{files[selectedFolder]?.length > 0 ? (
										files[selectedFolder].map(file => (
											<div key={file.id} className="file-card">
												<div className="file-icon">{getFileIcon(file.type)}</div>
												<div className="file-info">
													<div className="file-name" title={file.name}>{file.name}</div>
													<div className="file-meta">
														<span>{formatFileSize(file.size)}</span>
														<span>•</span>
														<span>{file.uploadedBy}</span>
													</div>
												</div>
												<div className="file-actions">
													<button
														onClick={() => handleDownloadFile(file)}
														className="btn-icon-sm"
														title="Download"
													>
														⬇️
													</button>
													<button
														onClick={() => handleDeleteFile(selectedFolder, file.id)}
														className="btn-icon-sm delete"
														title="Delete"
													>
														🗑️
													</button>
												</div>
											</div>
										))
									) : (
										<div className="empty-folder">
											<p>📂 This folder is empty</p>
											<p className="empty-hint">Upload files using the button above</p>
										</div>
									)}
								</div>
							</>
						) : (
							<div className="no-folder-selected">
								<h3>📁 Select a folder</h3>
								<p>Choose a folder from the sidebar to view and manage files</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default BusinessDocs;
