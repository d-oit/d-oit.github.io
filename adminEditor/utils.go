package main

import (
	"os"
	"path/filepath"
	"strings"
)

func listFiles(dir string, fs FileSystem) ([]string, error) {
	var files []string
	err := fs.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".md") {
			relPath, err := filepath.Rel(dir, path)
			if err != nil {
				return err
			}
			files = append(files, relPath)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return files, nil
}

func getFullPath(filename string, config Config) string {
	parts := strings.SplitN(filename, "/", 2)
	if len(parts) != 2 {
		return filename
	}

	lang, file := parts[0], parts[1]
	switch lang {
	case "de":
		return filepath.Join(config.Server.GermanFolder, file)
	case "en":
		return filepath.Join(config.Server.EnglishFolder, file)
	default:
		return filename
	}
}
