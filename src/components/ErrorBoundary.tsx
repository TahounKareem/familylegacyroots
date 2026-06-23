import React, { Component, ErrorInfo, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
  errorInfo?: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: '',
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo: errorInfo.componentStack });
    console.error('Uncaught error:', error, errorInfo);
    
    // Log crash to Firestore
    try {
      fetch('/api/log_error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          info: errorInfo.componentStack
        })
      }).catch(console.error);
    } catch (e) {}
    try {
      addDoc(collection(db, 'crash_logs'), {
        error: error.message,
        stack: error.stack,
        info: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    } catch (e) {
      console.error("Failed to write to crash_logs", e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6" dir="rtl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-lg w-full border border-red-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-4">عذراً، حدث خطأ غير متوقع</h1>
            <p className="text-red-700 mb-6">
              لقد سجل نظام الحماية الخاص بنا هذا الخطأ الفني (Crash Report) وجاري العمل على إصلاحه.
            </p>
            <div className="bg-red-50 p-4 rounded text-left overflow-auto mb-6 h-48 text-xs font-mono text-red-900 border border-red-200" dir="ltr">
              <span className="font-bold text-red-700">Error:</span> {this.state.errorMsg}
              <br/><br/>
              <span className="font-bold text-red-700">Component Stack:</span>
              <br/>
              {this.state.errorInfo}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
