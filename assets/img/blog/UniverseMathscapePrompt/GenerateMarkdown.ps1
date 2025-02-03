# Get the script's directory path
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$outputFile = Join-Path $scriptPath "output.md"

Write-Host "Script directory: $scriptPath"
Write-Host "Output file path: $outputFile"

# Ensure the output file is empty before starting
Set-Content -Path $outputFile -Value ""

# Get only image files (including .webp files)
$imageFiles = Get-ChildItem -Path $scriptPath -File | Where-Object { 
    $_.Extension -match '\.(png|jpg|jpeg|gif|webp|svg)$'
}

Write-Host "Found $($imageFiles.Count) image files"

foreach ($file in $imageFiles) {
    if ($file.Name -eq "GenerateMarkdown.ps1" -or $file.Name -eq "output.md" -or $file.Name -eq "prompt.md") {
        Write-Host "Skipping non-image file: $($file.Name)"
        continue
    }
    
    Write-Host "Processing file: $($file.Name)"
    
    try {
        # Append the Markdown entry to the output file
        Add-Content -Path $outputFile -Value "- src: ""img/UniverseMathscapePrompt/$($file.Name)"""
        Add-Content -Path $outputFile -Value "  title: ""$($file.BaseName)"""
        Write-Host "Added content for: $($file.Name)"
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}

Write-Host "Markdown file generated as $outputFile"
