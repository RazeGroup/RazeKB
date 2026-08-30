# Checklist - Local Windows Privilege Escalation
### **Best tool to look for Windows local privilege escalation vectors:** @@EX0@@

### @@EX1@@

- [ ] Obtain [**System information**](windows-local-privilege-escalation/index.html#system-info)
- [ ] Search for **kernel** [**exploits using scripts**](windows-local-privilege-escalation/index.html#version-exploits)
- [ ] Use **Google to search** for kernel **exploits**
- [ ] Use **searchsploit to search** for kernel **exploits**
- [ ] Interesting info in [**env vars**](windows-local-privilege-escalation/index.html#environment)?
- [ ] Passwords in [**PowerShell history**](windows-local-privilege-escalation/index.html#powershell-history)?
- [ ] Interesting info in [**Internet settings**](windows-local-privilege-escalation/index.html#internet-settings)?
- [ ] [**Drives**](windows-local-privilege-escalation/index.html#drives)?
- [ ] [**WSUS exploit**](windows-local-privilege-escalation/index.html#wsus)?
- [ ] [**Third-party agent auto-updaters / IPC abuse**](windows-local-privilege-escalation/abusing-auto-updaters-and-ipc.md)
- [ ] [**AlwaysInstallElevated**](windows-local-privilege-escalation/index.html#alwaysinstallelevated)?

### @@EX11@@

- [ ] Check [**Audit** ](windows-local-privilege-escalation/index.html#audit-settings)and [**WEF** ](windows-local-privilege-escalation/index.html#wef)settings
- [ ] Check [**LAPS**](windows-local-privilege-escalation/index.html#laps)
- [ ] Check if [**WDigest** ](windows-local-privilege-escalation/index.html#wdigest)is active
- [ ] [**LSA Protection**](windows-local-privilege-escalation/index.html#lsa-protection)?
- [ ] [**Credentials Guard**](windows-local-privilege-escalation/index.html#credentials-guard)[?](windows-local-privilege-escalation/index.html#cached-credentials)
- [ ] [**Cached Credentials**](windows-local-privilege-escalation/index.html#cached-credentials)?



- [ ] [**Admin Protection / UIAccess silent elevation**](windows-local-privilege-escalation/uiaccess-admin-protection-bypass.md)?
- [ ] [**Secure Desktop accessibility registry propagation (RegPwn)**](windows-local-privilege-escalation/secure-desktop-accessibility-registry-propagation-regpwn.md)?
- [ ] [**User Privileges**](windows-local-privilege-escalation/index.html#users-and-groups)
- [ ] Check [**current** user **privileges**](windows-local-privilege-escalation/index.html#users-and-groups)
- [ ] Are you [**member of any privileged group**](windows-local-privilege-escalation/index.html#privileged-groups)?
- [ ] Check if you have [any of these tokens enabled](windows-local-privilege-escalation/index.html#token-manipulation): **SeImpersonatePrivilege, SeAssignPrimaryPrivilege, SeTcbPrivilege, SeBackupPrivilege, SeRestorePrivilege, SeCreateTokenPrivilege, SeLoadDriverPrivilege, SeTakeOwnershipPrivilege, SeDebugPrivilege** ?
- [ ] Check if you have [**SeManageVolumePrivilege**](windows-local-privilege-escalation/semanagevolume-perform-volume-maintenance-tasks.md) to read raw volumes and bypass file ACLs
- [ ] [**Users Sessions**](windows-local-privilege-escalation/index.html#logged-users-sessions)?
- [ ] Check[ **users homes**](windows-local-privilege-escalation/index.html#home-folders) (access?)
- [ ] Check [**Password Policy**](windows-local-privilege-escalation/index.html#password-policy)
- [ ] What is[ **inside the Clipboard**](windows-local-privilege-escalation/index.html#get-the-content-of-the-clipboard)?

### @@EX31@@

- [ ] Check **current** [**network** **information**](windows-local-privilege-escalation/index.html#network)
- [ ] Check **hidden local services** restricted to the outside

### @@EX33@@

- [ ] Processes binaries [**file and folders permissions**](windows-local-privilege-escalation/index.html#file-and-folder-permissions)
- [ ] [**Memory Password mining**](windows-local-privilege-escalation/index.html#memory-password-mining)
- [ ] [**Insecure GUI apps**](windows-local-privilege-escalation/index.html#insecure-gui-apps)
- [ ] Steal credentials with **interesting processes** via `ProcDump.exe` ? (firefox, chrome, etc ...)

### @@EX37@@

- [ ] [Can you **modify any service**?](windows-local-privilege-escalation/index.html#permissions)
- [ ] [Can you **modify** the **binary** that is **executed** by any **service**?](windows-local-privilege-escalation/index.html#modify-service-binary-path)
- [ ] [Can you **modify** the **registry** of any **service**?](windows-local-privilege-escalation/index.html#services-registry-modify-permissions)
- [ ] [Can you take advantage of any **unquoted service** binary **path**?](windows-local-privilege-escalation/index.html#unquoted-service-paths)
- [ ] [Service Triggers: enumerate and trigger privileged services](windows-local-privilege-escalation/service-triggers.md)

### @@EX43@@

- [ ] **Write** [**permissions on installed applications**](windows-local-privilege-escalation/index.html#write-permissions)
- [ ] [**Startup Applications**](windows-local-privilege-escalation/index.html#run-at-startup)
- [ ] **Vulnerable** [**Drivers**](windows-local-privilege-escalation/index.html#drivers)

### @@EX47@@

- [ ] Can you **write in any folder inside PATH**?
- [ ] Is there any known service binary that **tries to load any non-existant DLL**?
- [ ] Can you **write** in any **binaries folder**?

### @@EX48@@

- [ ] Enumerate the network (shares, interfaces, routes, neighbours, ...)
- [ ] Take a special look at network services listening on localhost (127.0.0.1)

### @@EX49@@

- [ ] [**Winlogon** ](windows-local-privilege-escalation/index.html#winlogon-credentials)credentials
- [ ] [**Windows Vault**](windows-local-privilege-escalation/index.html#credentials-manager-windows-vault) credentials that you could use?
- [ ] Interesting [**DPAPI credentials**](windows-local-privilege-escalation/index.html#dpapi)?
- [ ] Passwords of saved [**Wifi networks**](windows-local-privilege-escalation/index.html#wifi)?
- [ ] Interesting info in [**saved RDP Connections**](windows-local-privilege-escalation/index.html#saved-rdp-connections)?
- [ ] Passwords in [**recently run commands**](windows-local-privilege-escalation/index.html#recently-run-commands)?
- [ ] [**Remote Desktop Credentials Manager**](windows-local-privilege-escalation/index.html#remote-desktop-credential-manager) passwords?
- [ ] [**AppCmd.exe** exists](windows-local-privilege-escalation/index.html#appcmd-exe)? Credentials?
- [ ] [**SCClient.exe**](windows-local-privilege-escalation/index.html#scclient-sccm)? DLL Side Loading?

### @@EX59@@

- [ ] **Putty:** [**Creds**](windows-local-privilege-escalation/index.html#putty-creds) **and** [**SSH host keys**](windows-local-privilege-escalation/index.html#putty-ssh-host-keys)
- [ ] [**SSH keys in registry**](windows-local-privilege-escalation/index.html#ssh-keys-in-registry)?
- [ ] Passwords in [**unattended files**](windows-local-privilege-escalation/index.html#unattended-files)?
- [ ] Any [**SAM & SYSTEM**](windows-local-privilege-escalation/index.html#sam-and-system-backups) backup?
- [ ] If [**SeManageVolumePrivilege**](windows-local-privilege-escalation/semanagevolume-perform-volume-maintenance-tasks.md) is present, try raw-volume reads for `SAM`, `SYSTEM`, DPAPI material, and `MachineKeys`
- [ ] [**Cloud credentials**](windows-local-privilege-escalation/index.html#cloud-credentials)?
- [ ] [**McAfee SiteList.xml**](windows-local-privilege-escalation/index.html#mcafee-sitelist.xml) file?
- [ ] [**Cached GPP Password**](windows-local-privilege-escalation/index.html#cached-gpp-pasword)?
- [ ] Password in [**IIS Web config file**](windows-local-privilege-escalation/index.html#iis-web-config)?
- [ ] Interesting info in [**web** **logs**](windows-local-privilege-escalation/index.html#logs)?
- [ ] Do you want to [**ask for credentials**](windows-local-privilege-escalation/index.html#ask-for-credentials) to the user?
- [ ] Interesting [**files inside the Recycle Bin**](windows-local-privilege-escalation/index.html#credentials-in-the-recyclebin)?
- [ ] Other [**registry containing credentials**](windows-local-privilege-escalation/index.html#inside-the-registry)?
- [ ] Inside [**Browser data**](windows-local-privilege-escalation/index.html#browsers-history) (dbs, history, bookmarks, ...)?
- [ ] [**Generic password search**](windows-local-privilege-escalation/index.html#generic-password-search-in-files-and-registry) in files and registry
- [ ] [**Tools**](windows-local-privilege-escalation/index.html#tools-that-search-for-passwords) to automatically search for passwords

### @@EX77@@

- [ ] Have you access to any handler of a process run by administrator?

### @@EX78@@

- [ ] Check if you can abuse it



## References

- [Project Zero - Bypassing Administrator Protection by Abusing UI Access](https://projectzero.google/2026/02/windows-administrator-protection.html?ref=rayanle.cat)
- [MDSec - RIP RegPwn](https://www.mdsec.co.uk/2026/03/rip-regpwn/?ref=rayanle.cat)
