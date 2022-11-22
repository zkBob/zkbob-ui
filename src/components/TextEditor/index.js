import React, { useRef, useEffect, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { Controlled as CodeMirrorDefault } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
require('codemirror/addon/display/placeholder');

export default ({ value, onChange, error, errorLines, placeholder }) => {
  const editorRef = useRef({});
  const theme = useTheme();

  const markLines = useCallback((from, to, isError) => {
    editorRef?.current?.editor?.markText(
      { line: from, ch: 0 },
      { line: to || editorRef?.current?.editor?.lineCount(), ch: 0 },
      { css: `color: ${theme.text.color[isError ? 'error' : 'secondary']}` }
    );
  }, [editorRef, theme]);

  useEffect(() => {
    markLines(0, null, false);
    errorLines?.forEach(errorLine => markLines(errorLine, errorLine + 1, true));
  }, [markLines, errorLines]);

  return (
    <CodeMirror
      value={value}
      onBeforeChange={(editor, metadata, value) => onChange(value)}
      ref={editorRef}
      options={{
        mode: 'csv',
        theme: 'material',
        lineNumbers: true,
        singleCursorHeightPerLine: false,
        lineWrapping: true,
        placeholder,
      }}
      $error={!!error}
    />
  );
};

const CodeMirror = styled(CodeMirrorDefault)`
  & .CodeMirror {
    height: auto;
    max-height: 260px;
    background: #fff;
    border: 1px solid ${props => props.theme.input.border.color[props.$error ? 'error' : 'default']};
    border-radius: 16px;
    overflow: hidden;
    outline: none !important;
    clip-path: none !important;
  }
  & .CodeMirror-scroll {
    min-height: 120px;
    max-height: 260px;
  }
  & .CodeMirror-gutters {
    background: #F4F3F8;
  }
  & .CodeMirror-linenumbers {
    width: 40px !important;
  }
  & .CodeMirror-linenumber {
    width: 40px !important;
    padding: 0;
    display: flex;
    justify-content: center;
    color: rgba(109, 100, 137, 0.6);
    padding-top: 10px !important;
  }
  & .CodeMirror-cursor {
    border-left: 1px solid ${props => props.theme.text.color.primary};
  }
  & .CodeMirror-selected {
    background-color: #b5d8fe !important;
  }
  & .CodeMirror-lines {
    padding: 20px 0;
  }
  & .CodeMirror-line {
    padding: 10px 24px 0 8px !important;
  }
  & .CodeMirror-code > div {
    &:first-child {
      .CodeMirror-line, .CodeMirror-linenumber {
        padding-top: 0 !important;
      }
    }
  }
  & .CodeMirror-line > span {
    color: ${props => props.theme.text.color.secondary};
  }
  & .CodeMirror-placeholder {
    color: rgba(109, 100, 137, 0.6) !important;
    padding: 0 24px 0 8px !important;
  }
  * {
    font-family: 'Gilroy';
    font-size: 14px;
    line-height: 20px;
  }
`;
