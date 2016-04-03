TARGETS = hostname.sh mountkernfs.sh mountdevsubfs.sh urandom mountall.sh mountall-bootclean.sh hwclock.sh checkroot.sh mountnfs.sh mountnfs-bootclean.sh checkfs.sh checkroot-bootclean.sh bootmisc.sh mtab.sh
INTERACTIVE = checkroot.sh checkfs.sh
mountdevsubfs.sh: mountkernfs.sh
urandom: mountall.sh mountall-bootclean.sh hwclock.sh
mountall.sh: checkfs.sh checkroot-bootclean.sh
mountall-bootclean.sh: mountall.sh
hwclock.sh: mountdevsubfs.sh
checkroot.sh: hwclock.sh mountdevsubfs.sh hostname.sh
mountnfs.sh: mountall.sh mountall-bootclean.sh
mountnfs-bootclean.sh: mountall.sh mountall-bootclean.sh mountnfs.sh
checkfs.sh: checkroot.sh mtab.sh
checkroot-bootclean.sh: checkroot.sh
bootmisc.sh: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh checkroot-bootclean.sh
mtab.sh: checkroot.sh
