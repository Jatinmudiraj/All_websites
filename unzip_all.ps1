
$root = "d:\project\All_website_theme"
$zips = Get-ChildItem -Path $root -Recurse -Filter "*.zip"

foreach ($zip in $zips) {
    Write-Host "Processing $($zip.FullName)"
    $dest = $zip.Directory.FullName
    
    # Check if code.html or index.html already exists to avoid unnecessary overwrite if previously done?
    # User asked to Unzip, so we force unzip.
    # We will expand to a temp folder then move files? or just expand to current dir.
    # stitch.zip usually contains code.html directly.
    
    Try {
        Expand-Archive -Path $zip.FullName -DestinationPath $dest -Force
        Write-Host "Unzipped $($zip.Name) to $dest"
        
        # Cleanup __MACOSX if exists
        if (Test-Path "$dest/__MACOSX") {
            Remove-Item "$dest/__MACOSX" -Recurse -Force
        }
    } Catch {
        Write-Error "Failed to unzip $($zip.FullName): $_"
    }
}
